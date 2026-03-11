#!/usr/bin/env python3
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REWRITER = ROOT / "scripts" / "style_rewriter.py"
DEFAULT_INPUT = ROOT / "drafts" / "input" / "pill_draft.txt"
DEFAULT_OUTPUT = ROOT / "drafts" / "output" / "pill_rewritten.txt"
DEFAULT_CHANGES = ROOT / "drafts" / "output" / "pill_changes.md"


def main() -> None:
    parser = argparse.ArgumentParser(description="Aplica el estilo del presidente a borradores de pildoras AI.")
    parser.add_argument("--input", default=str(DEFAULT_INPUT))
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
    parser.add_argument("--changes-output", default=str(DEFAULT_CHANGES))
    parser.add_argument("--type", default="reflexion")
    parser.add_argument("--goal", default="informar")
    parser.add_argument("--audience", default="directivo")
    parser.add_argument("--firmness", default="medio")
    parser.add_argument("--length", default="estandar")
    args = parser.parse_args()

    command = [
        sys.executable,
        str(REWRITER),
        "--input",
        str(Path(args.input).expanduser().resolve()),
        "--type",
        args.type,
        "--goal",
        args.goal,
        "--audience",
        args.audience,
        "--firmness",
        args.firmness,
        "--length",
        args.length,
        "--output",
        str(Path(args.output).expanduser().resolve()),
        "--changes-output",
        str(Path(args.changes_output).expanduser().resolve()),
    ]
    subprocess.run(command, check=True)
    print(Path(args.output).expanduser().resolve())
    print(Path(args.changes_output).expanduser().resolve())


if __name__ == "__main__":
    main()
