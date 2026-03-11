from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


ROOT = Path("/Users/santiagoisaacvallejoizquierdo/codex programas/isaval-ai-executive-hub")
OUTPUT = ROOT / "docs" / "Guia_proyecto_summary_html_pildoras_AI.pdf"


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleCustom",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=21,
            leading=26,
            textColor=colors.HexColor("#173047"),
            alignment=TA_LEFT,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Intro",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=11,
            leading=16,
            textColor=colors.HexColor("#2A4053"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Heading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=colors.HexColor("#0F5F94"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyCustom",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#1F2C3A"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletCustom",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            leftIndent=12,
            firstLineIndent=-9,
            bulletIndent=0,
            textColor=colors.HexColor("#1F2C3A"),
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Callout",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#1F4A37"),
            backColor=colors.HexColor("#F2FBF6"),
            borderColor=colors.HexColor("#CFE2D8"),
            borderWidth=0.6,
            borderPadding=8,
            borderRadius=4,
            spaceBefore=6,
            spaceAfter=8,
        )
    )
    return styles


def p(text, style):
    return Paragraph(text, style)


def bullet(text, style):
    return Paragraph(f"• {text}", style)


def build_story(styles):
    story = []
    story.append(p("Guía del Proyecto Summary HTML de Píldoras AI", styles["TitleCustom"]))
    story.append(
        p(
            "Documento explicativo para entrenar a ChatGPT y ayudarle a darme mejores instrucciones dentro de este proyecto.",
            styles["Intro"],
        )
    )
    story.append(
        p(
            "Objetivo práctico: que ChatGPT entienda qué estoy construyendo, cómo está organizado, qué quiero conseguir con cada nueva píldora y cómo debe formularme ayuda útil para trabajar con Codex.",
            styles["Callout"],
        )
    )

    story.append(p("1. Qué es este proyecto", styles["Heading"]))
    story.append(
        p(
            "Este proyecto es un repositorio web centralizado donde voy reuniendo mis reflexiones, casos reales y comunicaciones sobre inteligencia artificial para directivos no técnicos. No es una web comercial. Es un repositorio vivo de aprendizaje ejecutivo.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "La idea principal no es solo escribir textos, sino convertir esos textos en piezas publicables, visuales, ordenadas y reutilizables dentro de una misma web.",
            styles["BodyCustom"],
        )
    )

    story.append(p("2. Qué contiene hoy", styles["Heading"]))
    story.append(bullet("Una portada bilingüe con selector de idioma.", styles["BulletCustom"]))
    story.append(bullet("Una página principal en español y otra en inglés.", styles["BulletCustom"]))
    story.append(bullet("Un caso real llamado TenantFlow.", styles["BulletCustom"]))
    story.append(bullet("La 3ª píldora, centrada en EL DATO.", styles["BulletCustom"]))
    story.append(bullet("La 4ª píldora, centrada en cómo publico estas piezas en internet.", styles["BulletCustom"]))
    story.append(bullet("PDFs completos asociados a las píldoras 3 y 4 en español e inglés.", styles["BulletCustom"]))

    story.append(p("3. Cómo está organizado técnicamente", styles["Heading"]))
    story.append(
        p(
            "El repositorio central está en la carpeta <b>isaval-ai-executive-hub</b>. La lógica de trabajo es sencilla: la portada vive en la raíz y cada proyecto vive dentro de <b>projects/&lt;slug&gt;/</b>.",
            styles["BodyCustom"],
        )
    )
    story.append(bullet("La raíz contiene <b>index.html</b>, que hoy actúa como selector de idioma.", styles["BulletCustom"]))
    story.append(bullet("La portada real vive en <b>es/index.html</b> y <b>en/index.html</b>.", styles["BulletCustom"]))
    story.append(bullet("Cada proyecto tiene su propio selector de idioma y sus landings ES/EN.", styles["BulletCustom"]))
    story.append(bullet("Cloudflare publica el repositorio directamente desde esta estructura.", styles["BulletCustom"]))

    story.append(p("4. Flujo real de trabajo", styles["Heading"]))
    story.append(
        p(
            "El flujo habitual no empieza en HTML. Empieza en un texto mío, normalmente largo y escrito con mi voz. Después ese texto se corrige, se limpia y se reorganiza. Solo entonces se convierte en HTML ejecutivo.",
            styles["BodyCustom"],
        )
    )
    story.append(bullet("Yo redacto la versión base del memo o de la píldora.", styles["BulletCustom"]))
    story.append(bullet("Puedo usar ChatGPT para revisar claridad, orden y estilo, sin perder mi voz.", styles["BulletCustom"]))
    story.append(bullet("Antes de convertir a HTML, puedo pasar el borrador por el rewriter local conectado a mi perfil de estilo.", styles["BulletCustom"]))
    story.append(bullet("Luego pido a Codex que convierta ese contenido en HTML o PDF.", styles["BulletCustom"]))
    story.append(bullet("Después integro la nueva pieza en el hub y la publico.", styles["BulletCustom"]))

    story.append(p("5. Qué necesito que ChatGPT entienda sobre Codex", styles["Heading"]))
    story.append(
        p(
            "Codex no es aquí un generador abstracto de ideas. Es el ejecutor técnico del proyecto. Por tanto, cuando ChatGPT me ayude a preparar instrucciones, debe pensar en tareas accionables y no en teoría general.",
            styles["BodyCustom"],
        )
    )
    story.append(bullet("Si quiero una nueva píldora, ChatGPT debe ayudarme a definir el texto y el objetivo.", styles["BulletCustom"]))
    story.append(bullet("Si quiero una nueva página, ChatGPT debe ayudarme a formular qué estructura, estilo y contenido debe construir Codex.", styles["BulletCustom"]))
    story.append(bullet("Si quiero una mejora, ChatGPT debe describir con precisión qué archivo tocar y qué resultado espero ver.", styles["BulletCustom"]))
    story.append(bullet("Si quiero publicar, ChatGPT debe asumir que Codex hará la parte técnica y yo validaré el resultado.", styles["BulletCustom"]))

    story.append(p("6. Cómo conviene pedirme cosas dentro de este proyecto", styles["Heading"]))
    story.append(
        p(
            "Las mejores instrucciones son concretas, orientadas a resultado y referidas al repositorio central. ChatGPT debe evitar formular preguntas demasiado genéricas y debe apoyarse en la estructura ya existente.",
            styles["BodyCustom"],
        )
    )
    story.append(bullet("Bueno: 'Crea la 5ª píldora dentro del hub, mismo estilo que la 4ª, con versión ES/EN y PDF completo'.", styles["BulletCustom"]))
    story.append(bullet("Bueno: 'Añade un botón de vuelta a la portada en TenantFlow y revisa contraste'.", styles["BulletCustom"]))
    story.append(bullet("Bueno: 'Genera tres propuestas de texto para LinkedIn basadas en la 3ª píldora'.", styles["BulletCustom"]))
    story.append(bullet("Malo: 'Haz algo bonito sobre IA'.", styles["BulletCustom"]))
    story.append(bullet("Malo: 'Organiza la web mejor', sin indicar qué parte ni qué resultado concreto busco.", styles["BulletCustom"]))

    story.append(p("7. Criterios de diseño que se están siguiendo", styles["Heading"]))
    story.append(
        p(
            "El estilo de estas páginas no busca parecer una web corporativa clásica. Busca parecer un resumen ejecutivo moderno: limpio, serio, con jerarquía clara y lectura rápida.",
            styles["BodyCustom"],
        )
    )
    story.append(bullet("Una sola página por documento cuando es posible.", styles["BulletCustom"]))
    story.append(bullet("Versiones bilingües español/inglés.", styles["BulletCustom"]))
    story.append(bullet("Botones de navegación simples y visibles.", styles["BulletCustom"]))
    story.append(bullet("PDF completo como apoyo cuando el resumen HTML no basta.", styles["BulletCustom"]))

    story.append(p("8. Qué debería hacer ChatGPT cuando me ayude", styles["Heading"]))
    story.append(
        p(
            "Si uso este documento para entrenar a ChatGPT, quiero que me ayude sobre todo en cuatro cosas: escribir mejor, estructurar mejor, dar instrucciones más precisas a Codex y anticipar mejoras útiles en el proyecto.",
            styles["BodyCustom"],
        )
    )
    story.append(bullet("Ayudarme a transformar un memo largo en una píldora clara.", styles["BulletCustom"]))
    story.append(bullet("Respetar el perfil de estilo ya definido y no homogeneizar mi voz.", styles["BulletCustom"]))
    story.append(bullet("Proponer títulos, subtítulos y cierres más eficaces.", styles["BulletCustom"]))
    story.append(bullet("Convertir mis ideas en prompts accionables para Codex.", styles["BulletCustom"]))
    story.append(bullet("Mantener coherencia entre nuevas piezas y el hub ya creado.", styles["BulletCustom"]))

    story.append(p("9. Prompt base recomendado para trabajar conmigo en este proyecto", styles["Heading"]))
    story.append(
        p(
            "Cuando hable contigo sobre este proyecto, conviene que asumas lo siguiente: existe un repositorio central de píldoras AI para directivos no técnicos, ya publicado y bilingüe. Toda nueva pieza debe integrarse ahí, mantener el estilo existente, incluir navegación clara y, cuando proceda, un PDF completo asociado. Ayúdame a convertir mis borradores en instrucciones concretas para que Codex pueda ejecutar cambios reales en archivos, HTML, PDFs y publicación.",
            styles["BodyCustom"],
        )
    )

    story.append(p("10. Idea final", styles["Heading"]))
    story.append(
        p(
            "Este proyecto no va solo de escribir sobre IA. Va de usar IA para pensar, redactar, estructurar, publicar y mantener un canal ejecutivo vivo. Quiero que ChatGPT entienda esa lógica para ayudarme a pedírselo mejor a Codex.",
            styles["Callout"],
        )
    )
    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
        title="Guia proyecto summary html pildoras AI",
        author="Codex",
    )
    story = build_story(styles)
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    main()
