from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate


ROOT = Path("/Users/santiagoisaacvallejoizquierdo/codex programas/isaval-ai-executive-hub")
OUTPUT = ROOT / "projects" / "pildora-1" / "en" / "pildora-1-full-text-en.pdf"


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
    story.append(p("Pill 1 - Something big is happening", styles["TitleCustom"]))
    story.append(
        p(
            "Internal note for the executive committee and the board. Starting point of the executive AI pills project.",
            styles["MetaCustom"],
        )
    )
    story.append(
        p(
            "Before closing the week, and after everything we have been discussing around artificial intelligence, it is worth putting one simple idea in order: this is not a passing trend. It is a change with real strategic potential.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "From ownership, our conviction is clear. There is an opportunity here that we should understand and lead, not observe from the sidelines. The question is not whether this will have impact. The question is how fast, on which processes, and with what level of preparation it will reach us.",
            styles["BodyCustom"],
        )
    )

    story.append(p("1. The signal of acceleration", styles["HeadingCustom"]))
    story.append(
        p(
            "The episode of <i>The Daily AI Show</i> discussing Matt Shumer's post reinforces an intuition that is already present across many technology circles: we may be entering a new acceleration phase in AI. This is not about small incremental improvements. It is about systems that are more autonomous, more operational, and more useful for executing real work.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "That matters at executive level because it shifts the focus. We stop thinking only about tools that help write, summarize, or search, and we start thinking about agents capable of chaining tasks, acting across workflows, and producing valuable output with less human intervention.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "If that jump consolidates, competitive advantage will not belong to the companies that speak first about AI, but to those that start experimenting first on real business processes.",
            styles["Callout"],
        )
    )

    story.append(p("2. The necessary counterpoint", styles["HeadingCustom"]))
    story.append(
        p(
            "At the same time, it is worth balancing that reading with a second reference. Ignacio de la Torre's article adds an important qualification: today there is still not enough evidence to claim that we are already facing immediate and massive job destruction directly caused by AI. There are headlines, strong statements, and transformation signals, but that is not the same as conclusive proof.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "That counterpoint is valuable because it forces a more rigorous reading of the moment. Correlation is not causation. A cooling labor market and rapid AI progress do not automatically prove the same causal story, nor do they imply the same impact across every sector and company.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "The lesson, therefore, is not to downplay the change. The lesson is to avoid both naive enthusiasm and simplistic alarmism. It is unhelpful to say nothing is happening, and equally unhelpful to behave as if everything were already settled and fully understood.",
            styles["BodyCustom"],
        )
    )

    story.append(p("3. Our executive reading", styles["HeadingCustom"]))
    story.append(
        p(
            "In my view, the first major visible effect of this stage will not necessarily be sudden mass job disappearance. It will first be a widening gap between organizations and professionals that learn early how to work with these capabilities and those that continue operating as if nothing were changing.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "That implies several things. First, many administrative, analytical, and coordination processes will be executed better, faster, and with less friction. Second, business judgment will gain weight: having access to tools will not be enough; it will be necessary to detect where the real use case sits and which problem deserves redesign. Third, the learning curve itself will create an accumulating advantage for those who start sooner.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "Put simply: even if we still cannot measure the full employment effect with precision, we can already say that standing still will carry a very high competitive cost.",
            styles["Callout"],
        )
    )

    story.append(p("4. What we should do", styles["HeadingCustom"]))
    story.append(
        p(
            "Our approach should not be theoretical. It has to be practical, structured, and shared. That means working through concrete sessions, reviewing real cases, identifying business friction points, and turning them into improvement opportunities. This is not about turning everyone into a technician. It is about helping the organization think with these capabilities and incorporate them with business sense.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "There will be doubts, and that is normal. What we cannot allow ourselves is immobility. Nobody should be left behind in this process. The prudent move today is not to wait for everything to mature outside. The prudent move is to begin understanding, experimenting, and learning from within.",
            styles["BodyCustom"],
        )
    )
    story.append(
        p(
            "My proposal is straightforward: open this conversation with ambition, but also with method. With curiosity, but also with discipline. Above all, with the idea that this is not about watching a trend from a distance. It is about preparing ourselves to lead the part of it that can truly affect the company.",
            styles["BodyCustom"],
        )
    )

    story.append(p("Executive conclusion", styles["HeadingCustom"]))
    story.append(
        p(
            "We are facing an inflection point. The market may still not see the full scale of the change clearly, but there are already enough signals to take it seriously. The advantage will not go to whoever talks most about AI. It will go to whoever learns first how to apply it to real processes with judgment, focus, and speed.",
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
        title="Pill 1 Something big is happening",
        author="Codex",
    )
    doc.build(build_story(styles))
    print(OUTPUT)


if __name__ == "__main__":
    main()
