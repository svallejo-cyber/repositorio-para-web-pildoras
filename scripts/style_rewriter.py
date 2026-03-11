#!/usr/bin/env python3
from __future__ import annotations

import argparse
import difflib
import re
from pathlib import Path

import yaml


GOAL_MAP = {
    "informar": "informar",
    "pedir_accion": "pedir_accion",
    "corregir": "corregir",
    "negociar": "negociar",
    "reconocer": "reconocer",
    "escalar": "escalar",
}

AUDIENCE_MAP = {
    "interno": "interno",
    "equipo_interno": "interno",
    "directivo": "directivo",
    "proveedor": "proveedor",
    "cliente": "cliente",
    "consejo": "consejo",
}


def normalize_text(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def strip_existing_salutation(text: str, changes: list[str]) -> str:
    original = text
    text = re.sub(
        r"^(hola(?: equipo| a todos)?|buenos d[ií]as(?: a todos/as)?|buenas(?: tardes)?|estimado equipo|estimados)[,:]?\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )
    if text != original:
        changes.append("Se eliminó un saludo inicial redundante para reconstruir la apertura con el formato objetivo.")
    return text.strip()


def load_rules(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def split_sentences(text: str) -> list[str]:
    return [item.strip() for item in re.split(r"(?<=[.!?])\s+", text) if item.strip()]


def split_paragraphs(text: str) -> list[str]:
    return [item.strip() for item in re.split(r"\n\s*\n", text) if item.strip()]


def ensure_placeholder(text: str) -> str:
    return text


def remove_avoid_phrases(text: str, avoid_phrases: list[str], changes: list[str]) -> str:
    updated = text
    for phrase in avoid_phrases:
        pattern = re.compile(re.escape(phrase), flags=re.IGNORECASE)
        if pattern.search(updated):
            updated = pattern.sub("[POR DEFINIR]", updated)
            changes.append(f"Se neutralizó la frase a evitar `{phrase}`.")
    return updated


def condense_spacing(sentence: str) -> str:
    sentence = re.sub(r"\s+([,.;:])", r"\1", sentence)
    sentence = re.sub(r"\s{2,}", " ", sentence)
    return sentence.strip()


def clean_colloquialisms(text: str, changes: list[str]) -> str:
    replacements = {
        r"\bpor favor a ver si podemos\b": "podemos",
        r"\ba ver si podemos\b": "podemos",
        r"\bdecidme algo rapido\b": "Necesito confirmación rápida",
        r"\besto asi no puede seguir\b": "esto así no puede seguir",
        r"\buna unica version\b": "una única versión",
        r"\bperu\b": "Perú",
    }
    updated = text
    for pattern, replacement in replacements.items():
        candidate = re.sub(pattern, replacement, updated, flags=re.IGNORECASE)
        if candidate != updated:
            updated = candidate
    if updated != text:
        changes.append("Se limpiaron muletillas coloquiales para ganar claridad ejecutiva.")
    return updated


def overlaps_with_lead(current: str, lead: str) -> bool:
    current_words = re.findall(r"\w+", current.lower())[:4]
    lead_words = re.findall(r"\w+", lead.lower())[:4]
    return len(current_words) >= 3 and current_words[:3] == lead_words[:3]


def sentence_case(text: str) -> str:
    if not text:
        return text
    return text[0].upper() + text[1:]


def rewrite_sentences(sentences: list[str], goal: str, preferred_phrases: dict, firmness: str, changes: list[str]) -> list[str]:
    if not sentences:
        return []

    rewritten: list[str] = []
    goal_phrases = preferred_phrases.get(goal, [])
    lead = goal_phrases[0] if goal_phrases else ""
    firmness_prefix = {
        "suave": "Me gustaría que cuidáramos especialmente este punto.",
        "medio": "Necesitamos ordenar bien este punto.",
        "alto": "Necesitamos resolver este punto sin más desvíos.",
    }.get(firmness, "")

    for index, sentence in enumerate(sentences):
        current = condense_spacing(sentence)
        current = sentence_case(current)
        current = re.sub(r"\b(hay que)\b", "tenemos que", current, flags=re.IGNORECASE)
        if index == 0 and lead and not current.lower().startswith(lead.lower()) and not overlaps_with_lead(current, lead):
            current = f"{lead} {current}"
        if index == 1 and firmness_prefix and firmness != "suave" and not current.lower().startswith(firmness_prefix.lower()):
            current = f"{firmness_prefix} {current}"
        rewritten.append(current)

    if lead:
        changes.append(f"Se reforzó la apertura con una fórmula de intención para `{goal}`.")
    if firmness_prefix and firmness != "suave":
        changes.append(f"Se ajustó la firmeza al nivel `{firmness}` sin cambiar el contenido de fondo.")
    return rewritten


def chunk_paragraphs(sentences: list[str], length_mode: str) -> list[str]:
    max_sentences = {"breve": 2, "estandar": 3, "extensa": 4}.get(length_mode, 3)
    paragraphs = []
    buffer: list[str] = []
    for sentence in sentences:
        buffer.append(sentence)
        if len(buffer) >= max_sentences:
            paragraphs.append(" ".join(buffer).strip())
            buffer = []
    if buffer:
        paragraphs.append(" ".join(buffer).strip())
    return paragraphs


def add_structure(paragraphs: list[str], doc_type: str, audience: str, rules: dict, changes: list[str]) -> str:
    greeting = rules["greeting_templates"].get(audience, ["Buenos días,"])[0]
    closing = rules["closing_templates"].get(audience, ["Un saludo."])[0]
    body_parts = [greeting, ""]

    if doc_type in {"memo", "nota_comite", "nota para comité"}:
        body_parts.append("Contexto")
        body_parts.append(paragraphs[0] if paragraphs else "[POR DEFINIR]")
        if len(paragraphs) > 1:
            body_parts.extend(["", "Siguiente paso"])
            body_parts.extend(paragraphs[1:])
        changes.append("Se reordenó el texto en bloques explícitos para facilitar lectura ejecutiva.")
    else:
        body_parts.extend(paragraphs)

    body_parts.extend(["", closing])
    return "\n".join(body_parts).strip() + "\n"


def summarize_diff(original: str, rewritten: str, changes: list[str]) -> str:
    summary = list(dict.fromkeys(changes))
    if not summary:
        summary.append("Se normalizó el formato sin alterar el contenido.")
    if difflib.SequenceMatcher(a=original, b=rewritten).ratio() < 0.98:
        summary.append("Se mejoró la estructura general y la legibilidad del texto.")
    return "\n".join(f"- {item}" for item in summary) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Reescribe borradores con reglas de estilo deterministas.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--type", required=True)
    parser.add_argument("--goal", required=True)
    parser.add_argument("--audience", required=True)
    parser.add_argument("--firmness", default="medio")
    parser.add_argument("--length", default="estandar")
    parser.add_argument("--output", required=True)
    parser.add_argument("--rules", default=str(Path(__file__).resolve().parents[1] / "config" / "style_rules.yaml"))
    parser.add_argument("--changes-output", default=str(Path(__file__).resolve().parents[1] / "drafts" / "output" / "changes.md"))
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()
    rules_path = Path(args.rules).expanduser().resolve()
    changes_output = Path(args.changes_output).expanduser().resolve()

    rules = load_rules(rules_path)
    goal = GOAL_MAP.get(args.goal, args.goal)
    audience = AUDIENCE_MAP.get(args.audience, args.audience)

    original = normalize_text(input_path.read_text(encoding="utf-8"))
    changes: list[str] = []
    updated = ensure_placeholder(original)
    updated = strip_existing_salutation(updated, changes)
    updated = clean_colloquialisms(updated, changes)
    updated = remove_avoid_phrases(updated, rules.get("banned_or_avoid_phrases", []), changes)

    paragraphs = split_paragraphs(updated)
    sentences = split_sentences(" ".join(paragraphs))
    rewritten_sentences = rewrite_sentences(sentences, goal, rules.get("preferred_phrases", {}), args.firmness, changes)
    rewritten_paragraphs = chunk_paragraphs(rewritten_sentences, args.length)
    final_text = add_structure(rewritten_paragraphs, args.type, audience, rules, changes)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    changes_output.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(final_text, encoding="utf-8")
    changes_output.write_text(summarize_diff(original, final_text, changes), encoding="utf-8")


if __name__ == "__main__":
    main()
