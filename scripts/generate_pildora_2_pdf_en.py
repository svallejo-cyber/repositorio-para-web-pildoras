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
    story.append(p("Pill 2 - The advantage is not having AI. It is having real feedback", styles["TitleCustom"]))
    story.append(
        p(
            "Internal note for the executive committee and the board. Second piece of the executive AI pills project.",
            styles["MetaCustom"],
        )
    )
    story.append(
        p(
            "Many business conversations still frame the question in the same way: how do we use AI. In my view, that question is too small. The important issue is not using AI. The important issue is transforming the company into a continuous learning machine built on real data.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "That is what makes this strategic. Because this is not only about technology. It is about power structure. Future corporate power will belong to the companies that can capture better proprietary information, turn it into decisions, and close the action-measurement-adjustment loop before everyone else.",
            styles["Callout"],
        )
    )

    story.append(p("1. Where structural advantage sits", styles["HeadingCustom"]))
    story.append(
        p(
            "The advantage will not come from saying you have AI, nor from adding a cosmetic layer of automation. Structural advantage will come from four combined capabilities: controlling proprietary data, turning that data into useful models, making decisions faster, and closing the feedback loop earlier than competitors.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "That is the central point. The winner is not the company that buys more tools. The winner is the one that learns faster from the real market, from operations, and from customers. If a company can launch, measure, adjust, and launch again earlier than others, its advantage stops being tactical and becomes structural.",
            styles["BodyCustom"],
        )
    )

    story.append(p("2. This is not about pretty dashboards", styles["HeadingCustom"]))
    story.append(
        p(
            "Large companies will need serious technological infrastructure, internal ability to process data, and less blind dependence on third parties. Not everything can remain at the level of a pretty Power BI dashboard, an elegant control panel, or a retrospective view of what has already happened.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Value appears when data stops being a report and becomes a living decision system. When it feeds pricing, sales policy, assortment, demand forecasting, operations, and resource allocation almost in real time. When it does not merely describe. When it starts governing action better.",
            styles["BodyCustom"],
        )
    )

    story.append(p("3. The powerful thing is not the model", styles["HeadingCustom"]))
    story.append(
        p(
            "There is a frequent temptation to center the whole conversation on the model. Which model we use, which performs better, which is cheaper, or more sophisticated. That conversation matters, but it is not the decisive one. The model is not the true source of power. The surrounding system is.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "What truly differentiates a company is the ability to launch something into the market, measure what happens, adjust, launch again, and repeat that cycle with discipline. The model is one component. The learning circuit is the advantage. Without that circuit, AI becomes an interesting but marginal accessory. With that circuit, AI multiplies capability in a cumulative way.",
            styles["Callout"],
        )
    )

    story.append(p("4. What this means for Isaval", styles["HeadingCustom"]))
    story.append(
        p(
            "In our case, the applications are concrete: commercial policy, discounts, product mix, dynamic pricing, network optimization, demand forecasting, and stock management. All of those fronts generate data, decisions, and consequences. Therefore, all of them can become much faster and more precise learning cycles.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "If we convert those levers into a continuous system of testing, measurement, and correction, the company gains speed, judgment, and adaptive capacity. Sustained over time, that combination is what can make us exponential. Not because of technological magic, but because of operational discipline on real data.",
            styles["BodyCustom"],
        )
    )

    story.append(p("Executive conclusion", styles["HeadingCustom"]))
    story.append(
        p(
            "The advantage is not having AI. The advantage is having real feedback. The strongest companies will not be those that talk most about models, but those that best convert proprietary data into faster decisions and cumulative learning. That is where the new corporate power begins.",
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
