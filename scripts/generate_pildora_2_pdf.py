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
    story.append(p("2ª Píldora · La ventaja no es tener IA. Es tener feedback real", styles["TitleCustom"]))
    story.append(
        p(
            "Documento interno para comité y consejo. Segunda pieza del proyecto de píldoras ejecutivas de AI.",
            styles["MetaCustom"],
        )
    )
    story.append(
        p(
            "En muchas conversaciones empresariales se sigue planteando la misma pregunta: cómo usar IA. A mi juicio, esa pregunta se queda corta. La cuestión importante no es usar IA. La cuestión importante es transformar la compañía en una máquina de aprendizaje continuo basada en datos reales.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Eso sí es estratégico. Porque esto no va solo de tecnología. Va de estructura de poder. El poder empresarial del futuro lo tendrán las compañías capaces de capturar mejor información propia, convertirla en decisiones y cerrar antes que los demás el ciclo entre acción, medición y ajuste.",
            styles["Callout"],
        )
    )

    story.append(p("1. Dónde está la ventaja estructural", styles["HeadingCustom"]))
    story.append(
        p(
            "La ventaja no estará en decir que se tiene IA, ni en incorporar una capa cosmética de automatización. La ventaja estructural estará en cuatro capacidades combinadas: controlar datos propios, convertir esos datos en modelos útiles, tomar decisiones más rápido y cerrar el ciclo de feedback antes que los competidores.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Ese es el punto central. No gana quien compra más herramientas. Gana quien aprende más deprisa del mercado real, de sus operaciones y de sus clientes. Si una compañía puede lanzar, medir, ajustar y volver a lanzar antes que las demás, su ventaja deja de ser táctica y pasa a ser estructural.",
            styles["BodyCustom"],
        )
    )

    story.append(p("2. Esto no va de dashboards bonitos", styles["HeadingCustom"]))
    story.append(
        p(
            "En las grandes empresas hará falta infraestructura tecnológica seria, capacidad interna de procesar datos y menos dependencia ciega de terceros. No todo puede quedarse en un Power BI bonito, en un cuadro de mando elegante o en una lectura retrospectiva de lo que ya ha pasado.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "El valor aparece cuando el dato deja de ser un informe y se convierte en un sistema vivo de decisión. Cuando alimenta pricing, red comercial, surtido, previsión, operaciones y asignación de recursos casi en tiempo real. Cuando no se limita a describir. Cuando empieza a gobernar mejor la acción.",
            styles["BodyCustom"],
        )
    )

    story.append(p("3. Lo potente no es el modelo", styles["HeadingCustom"]))
    story.append(
        p(
            "Hay una tentación muy habitual: centrar la conversación en el modelo. Qué modelo usamos, cuál rinde más, cuál es más barato o más sofisticado. Esa conversación importa, pero no es la decisiva. Lo potente no es el modelo en sí. Lo potente es el sistema que lo rodea.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Lo verdaderamente diferencial es poder lanzar algo al mercado, medir qué ocurre, ajustar, volver a lanzar y hacerlo una y otra vez con disciplina. El modelo es una pieza. El circuito de aprendizaje es la ventaja. Si ese circuito no existe, la IA se convierte en un accesorio interesante pero marginal. Si ese circuito existe, entonces la IA multiplica capacidad de forma acumulativa.",
            styles["Callout"],
        )
    )

    story.append(p("4. Qué significa esto para Isaval", styles["HeadingCustom"]))
    story.append(
        p(
            "En nuestro caso, las aplicaciones son muy concretas. Política comercial, descuentos, mix de producto, pricing dinámico, optimización de red, previsión de demanda y gestión de stock. Todos esos frentes generan datos, decisiones y consecuencias. Por tanto, todos pueden convertirse en ciclos de aprendizaje mucho más rápidos y precisos.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Si convertimos esas palancas en un sistema continuo de prueba, medición y corrección, la compañía gana velocidad, criterio y capacidad de adaptación. Y esa combinación, sostenida en el tiempo, es la que puede volvernos exponenciales. No por magia tecnológica, sino por disciplina operativa sobre datos reales.",
            styles["BodyCustom"],
        )
    )

    story.append(p("Conclusión ejecutiva", styles["HeadingCustom"]))
    story.append(
        p(
            "La ventaja no es tener IA. La ventaja es tener feedback real. Las compañías más fuertes no serán las que más hablen de modelos, sino las que mejor conviertan sus datos propios en decisiones más rápidas y en aprendizaje acumulativo. Ahí es donde empieza el poder empresarial nuevo.",
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
