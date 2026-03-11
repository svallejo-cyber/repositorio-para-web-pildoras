from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate


ROOT = Path("/Users/santiagoisaacvallejoizquierdo/codex programas/isaval-ai-executive-hub")
OUTPUT = ROOT / "projects" / "pildora-2" / "en" / "pildora-2-full-text-en.pdf"


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
    story.append(p("Pill 2 - The advantage is not having AI. It is closing the feedback loop", styles["TitleCustom"]))
    story.append(
        p(
            "Internal note for the executive committee and the board. Second piece of the executive AI pills project.",
            styles["MetaCustom"],
        )
    )
    story.append(
        p(
            "The FT piece on the convergence between quant shops and AI labs leaves one useful idea: beneath the technology narrative, the winners are starting to look very similar. They all compete with the same machine: data, model, constraints, execution, and feedback.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Applied to an industrial company like ours, the lesson is not that we should behave like a hedge fund. The lesson is simpler: future advantage will belong to the companies that capture business reality better, turn it earlier into decisions, and learn faster than the market.",
            styles["Callout"],
        )
    )

    story.append(p("1. What this article really says", styles["HeadingCustom"]))
    story.append(
        p(
            "The core thesis is that an AI lab and an organization obsessed with quantitative decision-making end up building similar systems. Not because they sell the same thing, but because both require high-quality data, modelling capability, disciplined deployment, and a continuous feedback loop from the real world.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "That is why the good conversation is not \"which model do we use\" but \"what learning system are we building\". The model matters, yes. But on its own it does not create durable advantage.",
            styles["BodyCustom"],
        )
    )

    story.append(p("2. The advantage is not in the model", styles["HeadingCustom"]))
    story.append(
        p(
            "The powerful thing is not the model itself. The powerful thing is being able to launch something, measure what happens, adjust, and launch again. When that circuit exists, the company learns. When it does not, AI remains a demo, a pretty dashboard, or a one-off automation without structural effect.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "That is why the advantage is not having AI. The advantage is having real feedback. Proprietary data, properly captured, properly read, and tied to decisions that can be reviewed quickly.",
            styles["BodyCustom"],
        )
    )

    story.append(p("3. What this means for an industrial company", styles["HeadingCustom"]))
    story.append(
        p(
            "At Isaval this does not mean building a futuristic lab. It means using real business information better in areas where we already make decisions every day: commercial policy, discounts, product mix, pricing, network optimization, demand forecasting, and stock management.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "If we turn those fronts into a continuous loop of testing, measurement, and correction, the company gains three things: more speed, better judgment, and greater adaptive capacity. That is strategic. That is what changes competitive position.",
            styles["Callout"],
        )
    )

    story.append(p("Executive conclusion", styles["HeadingCustom"]))
    story.append(
        p(
            "The useful reading here is not technological but managerial: the strongest companies will not be those that talk most about AI, but those that best convert proprietary data into better and faster decisions. The article points to that machine. We should build ours with both feet on the ground of an industrial business.",
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
        title="Pill 2 The advantage is not having AI",
        author="Codex",
    )
    doc.build(build_story(build_styles()))
    print(OUTPUT)


if __name__ == "__main__":
    main()
