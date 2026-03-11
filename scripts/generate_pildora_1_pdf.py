from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


ROOT = Path("/Users/santiagoisaacvallejoizquierdo/codex programas/isaval-ai-executive-hub")
OUTPUT = ROOT / "projects" / "pildora-1" / "es" / "pildora-1-full-text-es.pdf"


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
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="MetaCustom",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.3,
            leading=14,
            textColor=colors.HexColor("#4E6070"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="HeadingCustom",
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
            fontSize=10.6,
            leading=15.2,
            textColor=colors.HexColor("#1F2C3A"),
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Callout",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.6,
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


def build_story(styles):
    story = []
    story.append(p("1ª Píldora · Algo grande está pasando", styles["TitleCustom"]))
    story.append(
        p(
            "Documento interno para comité y consejo. Punto de partida del proyecto de píldoras ejecutivas de AI.",
            styles["MetaCustom"],
        )
    )
    story.append(
        p(
            "Antes de cerrar la semana, y después de todo lo que hemos venido removiendo sobre inteligencia artificial, conviene ordenar una idea sencilla: no estamos ante una moda pasajera, sino ante un cambio con potencial estratégico real.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Desde la propiedad tenemos la convicción de que aquí hay una oportunidad que debemos entender y liderar, no observar desde la barrera. La cuestión no es si esto va a impactar. La cuestión es con qué rapidez, sobre qué procesos y con qué preparación nos va a encontrar.",
            styles["BodyCustom"],
        )
    )

    story.append(p("1. La señal de aceleración", styles["HeadingCustom"]))
    story.append(
        p(
            "El episodio de <i>The Daily AI Show</i> que comenta el post de Matt Shumer refuerza una intuición que ya está presente en muchos entornos tecnológicos: podríamos estar entrando en una nueva fase de aceleración en IA. No habla de pequeñas mejoras incrementales. Habla de sistemas más autónomos, más operativos y más útiles para ejecutar trabajo real.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "La idea de fondo es relevante para dirección porque desplaza el foco. Dejamos de pensar solo en herramientas que ayudan a redactar, resumir o buscar, y empezamos a pensar en agentes capaces de encadenar tareas, decidir sobre un flujo y producir output de valor con menor intervención humana.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Si ese salto se consolida, la ventaja competitiva no estará en hablar antes de IA, sino en haber empezado antes a experimentar sobre procesos concretos del negocio.",
            styles["Callout"],
        )
    )

    story.append(p("2. El contrapunto necesario", styles["HeadingCustom"]))
    story.append(
        p(
            "Ahora bien, conviene poner esa lectura en tensión con una segunda referencia. El artículo de Ignacio de la Torre introduce un matiz importante: hoy todavía no hay evidencia suficiente para sostener que estemos ante una destrucción masiva e inmediata de empleo causada directamente por la IA. Hay titulares, hay discursos muy contundentes y hay señales de transformación, pero no conviene convertir eso automáticamente en certeza.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Ese contrapunto es útil porque nos obliga a leer el momento con más rigor. Correlación no es causalidad. Que el mercado laboral se enfríe en algunos segmentos y que la IA avance con mucha fuerza no significa, por sí solo, que todo el impacto ya esté demostrado ni que vaya a producirse de la misma manera en todos los sectores y empresas.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "La lección, por tanto, no es minimizar el cambio. La lección es evitar tanto el alarmismo simple como la complacencia. Ni conviene decir que no pasa nada, ni conviene actuar como si todo estuviera ya resuelto y perfectamente entendido.",
            styles["BodyCustom"],
        )
    )

    story.append(p("3. Nuestra lectura ejecutiva", styles["HeadingCustom"]))
    story.append(
        p(
            "A mi juicio, el primer gran efecto de esta etapa no será necesariamente una desaparición súbita y masiva del trabajo. Será, antes, una diferencia creciente entre organizaciones y personas que aprendan pronto a trabajar con estas capacidades y otras que sigan operando como si nada estuviera cambiando.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Eso significa varias cosas. Primero, que muchos procesos administrativos, analíticos y de coordinación van a poder ejecutarse mejor, más rápido y con menos fricción. Segundo, que el criterio de negocio va a ganar peso: no bastará con disponer de herramientas; hará falta detectar dónde está el caso de uso y qué problema merece ser rediseñado. Y tercero, que la curva de aprendizaje va a generar una ventaja acumulativa para quienes empiecen antes.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Dicho de forma directa: quizá todavía no podamos medir con precisión todo el efecto sobre el empleo, pero sí podemos afirmar que quedarse quietos tendrá un coste competitivo muy alto.",
            styles["Callout"],
        )
    )

    story.append(p("4. Qué deberíamos hacer", styles["HeadingCustom"]))
    story.append(
        p(
            "Nuestro enfoque no debe ser teórico. Tiene que ser práctico, ordenado y compartido. Esto implica trabajar con sesiones concretas, revisar casos reales, identificar fricciones del negocio y convertirlas en oportunidades de mejora. No se trata de convertir a nadie en técnico. Se trata de que la organización aprenda a pensar con estas nuevas capacidades y a incorporarlas con sentido empresarial.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Habrá dudas, y es normal que las haya. Pero lo que no podemos permitirnos es la inmovilidad. Nadie debería quedarse atrás en este proceso. Lo prudente hoy no es esperar a que todo madure fuera. Lo prudente es empezar a entender, experimentar y aprender dentro.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Mi propuesta es sencilla: abrir esta conversación con ambición, pero también con método. Con curiosidad, pero también con disciplina. Y, sobre todo, con la idea de que esto no va de contemplar una tendencia desde fuera, sino de prepararnos para liderar aquello que de verdad tenga impacto en la compañía.",
            styles["BodyCustom"],
        )
    )

    story.append(p("Conclusión ejecutiva", styles["HeadingCustom"]))
    story.append(
        p(
            "Estamos ante un punto de inflexión. Quizá el mercado todavía no vea con nitidez toda la magnitud del cambio, pero ya hay suficientes señales como para tomárselo en serio. La ventaja no será para quien más hable de IA. Será para quien antes aprenda a aplicarla sobre procesos reales con criterio, foco y velocidad.",
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
        title="1a Pildora Algo grande esta pasando",
        author="Codex",
    )
    story = build_story(styles)
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    main()
