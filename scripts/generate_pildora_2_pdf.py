from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate


ROOT = Path("/Users/santiagoisaacvallejoizquierdo/codex programas/isaval-ai-executive-hub")
OUTPUT = ROOT / "projects" / "pildora-2" / "es" / "pildora-2-full-text-es.pdf"


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
    story.append(p("2ª Píldora · La ventaja no es tener IA. Es cerrar el feedback", styles["TitleCustom"]))
    story.append(
        p(
            "Documento interno para comité y consejo. Segunda pieza del proyecto de píldoras ejecutivas de AI.",
            styles["MetaCustom"],
        )
    )
    story.append(
        p(
            "El artículo del FT sobre la convergencia entre los quant shops y los laboratorios de IA deja una idea útil: por debajo del discurso tecnológico, los ganadores empiezan a parecerse mucho. Todos compiten con la misma máquina: datos, modelo, restricciones, ejecución y feedback.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Llevado a una empresa industrial como la nuestra, la lectura no es que debamos comportarnos como un hedge fund. La lectura es más simple: la ventaja futura estará en capturar mejor la realidad del negocio, convertirla antes en decisión y aprender más rápido que el mercado.",
            styles["Callout"],
        )
    )

    story.append(p("1. Qué nos dice de verdad este artículo", styles["HeadingCustom"]))
    story.append(
        p(
            "La tesis de fondo es que un laboratorio de IA y una organización obsesionada con decisión cuantitativa terminan construyendo cosas parecidas. No porque vendan lo mismo, sino porque los dos necesitan datos de calidad, capacidad de modelizar, disciplina de despliegue y un sistema continuo de feedback desde el mundo real.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Eso explica por qué la conversación buena no es \"qué modelo usamos\" sino \"qué sistema de aprendizaje estamos construyendo\". El modelo importa, sí. Pero por sí solo no crea ventaja duradera.",
            styles["BodyCustom"],
        )
    )

    story.append(p("2. La ventaja no está en el modelo", styles["HeadingCustom"]))
    story.append(
        p(
            "Lo potente no es el modelo. Lo potente es poder lanzar algo, medir qué pasa, ajustar y volver a lanzar. Cuando ese circuito existe, la compañía aprende. Cuando no existe, la IA se queda en demostración, en dashboard bonito o en automatización puntual sin efecto estructural.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Por eso la ventaja no es tener IA. La ventaja es tener feedback real. Datos propios, bien capturados, bien leídos y ligados a decisiones que se puedan revisar rápido.",
            styles["BodyCustom"],
        )
    )

    story.append(p("3. Qué significa esto para una empresa industrial", styles["HeadingCustom"]))
    story.append(
        p(
            "En Isaval esto no va de montar un laboratorio futurista. Va de usar mejor la información real del negocio en ámbitos donde ya decidimos todos los días: política comercial, descuentos, mix de producto, pricing, optimización de red, previsión de demanda o gestión de stock.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Si convertimos esos frentes en un ciclo continuo de prueba, medición y corrección, la compañía gana tres cosas: más velocidad, mejor criterio y más capacidad de adaptación. Eso sí es estratégico. Eso sí cambia la posición competitiva.",
            styles["Callout"],
        )
    )

    story.append(p("Conclusión ejecutiva", styles["HeadingCustom"]))
    story.append(
        p(
            "La lectura útil no es tecnológica, sino empresarial: las compañías más fuertes no serán las que más hablen de IA, sino las que mejor conviertan datos propios en decisiones mejores y más rápidas. El artículo llama la atención sobre esa máquina. Nosotros deberíamos construir la nuestra con los pies en la realidad industrial del negocio.",
            styles["Callout"],
        )
    )
    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
        title="2a Pildora La ventaja no es tener IA",
        author="Codex",
    )
    doc.build(build_story(build_styles()))
    print(OUTPUT)


if __name__ == "__main__":
    main()
