from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.profile import Profile
from app.models.job import Job
from app.models.application import Application
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).first():
            print("Database already seeded. Skipping.")
            return

        print("Seeding database with Creator Economy wedge data...")

        # 1. Creators
        hashed_pw = get_password_hash("password123")
        c1 = User(
            email="creator.tech@creatoros.in",
            full_name="Tech Talkies India",
            user_type="creator",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            hashed_password=hashed_pw
        )
        c2 = User(
            email="creator.fitness@creatoros.in",
            full_name="FitLife with Kabir",
            user_type="creator",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            hashed_password=hashed_pw
        )
        c3 = User(
            email="creator.finance@creatoros.in",
            full_name="FinBytes India",
            user_type="creator",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
            hashed_password=hashed_pw
        )

        db.add_all([c1, c2, c3])
        db.commit()
        for c in [c1, c2, c3]:
            db.refresh(c)

        # Creator profiles
        cp1 = Profile(
            user_id=c1.id,
            bio="Leading Tech & Gadget review channel with 450K subscribers across YouTube & Instagram.",
            niche="Tech & Reviews",
            subscriber_count="450K+",
            location="Bengaluru, IN",
            brand_name="TechTalkies",
            instagram_handle="@techtalkies"
        )
        cp2 = Profile(
            user_id=c2.id,
            bio="Fitness & Lifestyle channel producing 4 Reels/week + 2 YouTube Vlogs.",
            niche="Fitness & Wellness",
            subscriber_count="820K+",
            location="Mumbai, IN",
            brand_name="FitLifeKabir",
            instagram_handle="@fitlifekabir"
        )
        cp3 = Profile(
            user_id=c3.id,
            bio="Simplifying personal finance, stock market insights, and wealth management for Gen Z.",
            niche="Finance & Investing",
            subscriber_count="290K+",
            location="Delhi NCR, IN",
            brand_name="FinBytes",
            instagram_handle="@finbytes"
        )
        db.add_all([cp1, cp2, cp3])

        # 2. Professionals (Initial Wedge: Editors, SMMs, Creator Managers)
        p1 = User(
            email="aarav.editor@creatoros.in",
            full_name="Aarav Sharma",
            user_type="professional",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            hashed_password=hashed_pw
        )
        p2 = User(
            email="dev.motion@creatoros.in",
            full_name="Dev Patel",
            user_type="professional",
            avatar_url="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
            hashed_password=hashed_pw
        )
        p3 = User(
            email="ananya.smm@creatoros.in",
            full_name="Ananya Verma",
            user_type="professional",
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
            hashed_password=hashed_pw
        )
        p4 = User(
            email="rohan.manager@creatoros.in",
            full_name="Rohan Gupta",
            user_type="professional",
            avatar_url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
            hashed_password=hashed_pw
        )

        db.add_all([p1, p2, p3, p4])
        db.commit()
        for p in [p1, p2, p3, p4]:
            db.refresh(p)

        # Professional Profiles
        pp1 = Profile(
            user_id=p1.id,
            primary_role="Video Editor",
            bio="4+ years editing fast-paced YouTube tech reviews and retention-focused Reels. Expert in Premiere Pro & DaVinci.",
            location="Bengaluru, IN",
            experience_years=4,
            skills=["Premiere Pro", "DaVinci Resolve", "YouTube Retention Editing", "CapCut Pro"],
            portfolio_links=["https://youtube.com/showcase-aarav", "https://vimeo.com/aarav-edits"],
            rate_range="₹35,000 - ₹55,000 / mo",
            rating=4.9,
            completed_projects=28,
            verified=True,
            education="B.A. in Digital Media, IIT Bombay"
        )
        pp2 = Profile(
            user_id=p2.id,
            primary_role="Video Editor",
            bio="Specializing in 2D/3D Motion Graphics, Alex Hormozi style captions, and high-converting Shorts for top creators.",
            location="Mumbai, IN",
            experience_years=3,
            skills=["After Effects", "Motion Graphics", "Sound Design", "Reels/Shorts"],
            portfolio_links=["https://behance.net/devpatel-edits"],
            rate_range="₹25,000 - ₹40,000 / mo",
            rating=4.8,
            completed_projects=19,
            verified=True,
            education="Diploma in 3D Animation, MAAC"
        )
        pp3 = Profile(
            user_id=p3.id,
            primary_role="Social Media Manager",
            bio="Scaled 5 creator channels from 10K to 200K+ followers. Content strategy, posting schedules, and community management.",
            location="Delhi NCR, IN",
            experience_years=5,
            skills=["Instagram Growth", "YouTube SEO", "Content Strategy", "Analytics & Reporting"],
            portfolio_links=["https://notion.so/ananya-smm-case-studies"],
            rate_range="₹30,000 - ₹50,000 / mo",
            rating=5.0,
            completed_projects=35,
            verified=True,
            education="B.B.A. in Marketing, Delhi University"
        )
        pp4 = Profile(
            user_id=p4.id,
            primary_role="Creator Manager",
            bio="End-to-end ops for top 1% creators: Brand deal outreach, team coordination, logistics, and video production scheduling.",
            location="Remote / Mumbai, IN",
            experience_years=6,
            skills=["Brand Sponsorship Negotiation", "Team Management", "Workflow Automation", "Contract Handling"],
            portfolio_links=["https://linkedin.com/in/rohan-gupta-creator-ops"],
            rate_range="₹50,000 - ₹80,000 / mo",
            rating=4.9,
            completed_projects=14,
            verified=True
        )
        db.add_all([pp1, pp2, pp3, pp4])

        # 3. Jobs
        j1 = Job(
            creator_id=c1.id,
            title="Lead YouTube & Reels Video Editor (Tech Channel)",
            role_category="Video Editor",
            description="We publish 2 full-length YouTube tech reviews per week + 4 Reels. Looking for an editor who understands quick jump cuts, crisp B-roll sync, motion graphics, and retention hooks.",
            budget="₹40,000 - ₹60,000 / month",
            work_type="Retainer",
            availability="Full-time (30-40 hrs/wk)",
            platforms=["YouTube", "Instagram Reels"],
            status="open"
        )
        j2 = Job(
            creator_id=c2.id,
            title="Short-Form Content Editor (4 Reels/Week)",
            role_category="Video Editor",
            description="Need a dedicated short-form editor for fitness/vlog content. High energy music transitions, clean subtitles, dynamic captions.",
            budget="₹25,000 - ₹35,000 / month",
            work_type="Part-time",
            availability="15-20 hrs/wk",
            platforms=["Instagram Reels", "YouTube Shorts"],
            status="open"
        )
        j3 = Job(
            creator_id=c3.id,
            title="Social Media Manager & Growth Strategist",
            role_category="Social Media Manager",
            description="Manage posting schedule, optimize YouTube titles/thumbnails/tags, write engaging carousel copy for Instagram, and track analytics.",
            budget="₹35,000 - ₹50,000 / month",
            work_type="Retainer",
            availability="20-25 hrs/wk",
            platforms=["Instagram", "YouTube", "LinkedIn"],
            status="open"
        )
        j4 = Job(
            creator_id=c1.id,
            title="Executive Creator Operations Manager",
            role_category="Creator Manager",
            description="Looking for an experienced manager to oversee content calendar, coordinate video editors & designers, negotiate inbound brand deals, and keep production smooth.",
            budget="₹60,000 - ₹90,000 / month",
            work_type="Full-time",
            availability="40 hrs/wk",
            platforms=["YouTube", "Instagram", "Email/Ops"],
            status="open"
        )
        db.add_all([j1, j2, j3, j4])
        db.commit()
        for j in [j1, j2, j3, j4]:
            db.refresh(j)

        # 4. Applications
        a1 = Application(
            job_id=j1.id,
            applicant_id=p1.id,
            cover_note="Hey! I have edited over 100+ tech videos with retention rates averaging 65%. Check out my sample tech review edit attached.",
            portfolio_link="https://youtube.com/showcase-aarav",
            proposed_rate="₹45,000 / month",
            status="hired"
        )
        a2 = Application(
            job_id=j2.id,
            applicant_id=p2.id,
            cover_note="Hi Kabir! I specialize in high-energy fitness reels with motion titles and upbeat pacing.",
            portfolio_link="https://behance.net/devpatel-edits",
            proposed_rate="₹28,000 / month",
            status="submitted"
        )
        a3 = Application(
            job_id=j3.id,
            applicant_id=p3.id,
            cover_note="I've grown 3 finance creators on Instagram by analyzing retention drop-offs and crafting hook-heavy carousels.",
            portfolio_link="https://notion.so/ananya-smm-case-studies",
            proposed_rate="₹40,000 / month",
            status="submitted"
        )
        db.add_all([a1, a2, a3])
        db.commit()

        print("Seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
