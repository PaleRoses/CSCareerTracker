-- =============================================================================
-- SEED DATA FOR CS CAREER TRACKER
-- Magical-themed fantasy companies with realistic application journeys
-- =============================================================================
-- Users:
--   Rosalia:  102182222430157775253 (mostly rejections, one Starbucks barista offer)
--   Baron S:  106077827475034522998 (mixed results)
--   Khanh:    113198465471291118912 (slightly more successes)
-- =============================================================================


-- =========================
-- COMPANIES (Elegant Fantasy Theme)
-- =========================
INSERT INTO companies (
    company_id, company_name, locations, size, website, metadata
) VALUES
    ('c0000001-0000-0000-0000-000000000001',
     'Starlit Innovations', ARRAY['San Francisco, CA', 'Remote'], 450,
     'https://starlit.dev', '{}'::jsonb),

    ('c0000002-0000-0000-0000-000000000002',
     'Selesine Systems', ARRAY['Seattle, WA'], 200,
     'https://selesine.io', '{}'::jsonb),

    ('c0000003-0000-0000-0000-000000000003',
     'Moonveil Labs', ARRAY['Austin, TX', 'Remote'], 800,
     'https://moonveil.tech', '{}'::jsonb),

    ('c0000004-0000-0000-0000-000000000004',
     'Verdant Software', ARRAY['Portland, OR'], 120,
     'https://verdant.software', '{}'::jsonb),

    ('c0000005-0000-0000-0000-000000000005',
     'Obsidian Technologies', ARRAY['New York, NY'], 1500,
     'https://obsidian.tech', '{}'::jsonb),

    ('c0000006-0000-0000-0000-000000000006',
     'Prismatic AI', ARRAY['Boston, MA', 'Remote'], 300,
     'https://prismatic.ai', '{}'::jsonb),

    ('c0000007-0000-0000-0000-000000000007',
     'Emberheart Games', ARRAY['Los Angeles, CA'], 85,
     'https://emberheart.games', '{}'::jsonb),

    ('c0000008-0000-0000-0000-000000000008',
     'Frostbyte Computing', ARRAY['Denver, CO'], 250,
     'https://frostbyte.dev', '{}'::jsonb),

    ('c0000009-0000-0000-0000-000000000009',
     'Wanderlust Digital', ARRAY['Remote'], 60,
     'https://wanderlust.digital', '{}'::jsonb),

    ('c0000010-0000-0000-0000-000000000010',
     'Silverwind Consulting', ARRAY['Chicago, IL'], 180,
     'https://silverwind.co', '{}'::jsonb),

    ('c0000011-0000-0000-0000-000000000011',
     'Celestine Data', ARRAY['San Jose, CA'], 400,
     'https://celestine.data', '{}'::jsonb),

    ('c0000012-0000-0000-0000-000000000012',
     'Aethon Cloud', ARRAY['Seattle, WA', 'Remote'], 650,
     'https://aethon.cloud', '{}'::jsonb),

    ('c0000013-0000-0000-0000-000000000013',
     'Lumina Analytics', ARRAY['New York, NY'], 220,
     'https://lumina.io', '{}'::jsonb),

    ('c0000014-0000-0000-0000-000000000014',
     'Solstice Labs', ARRAY['Austin, TX'], 90,
     'https://solstice.labs', '{}'::jsonb),

    -- The one that matters for Rosalia
    ('c0000015-0000-0000-0000-000000000015',
     'Starbucks', ARRAY['Seattle, WA', 'Everywhere'], 400000,
     'https://starbucks.com', '{}'::jsonb),

    -- Moon-themed Companies (Rosalia)
    ('c1000001-0000-0000-0000-000000000001',
     'Lunaria Labs', ARRAY['San Francisco, CA', 'Remote'], 320,
     'https://lunaria.dev', '{}'::jsonb),
    ('c1000002-0000-0000-0000-000000000002',
     'Moonstone Analytics', ARRAY['Seattle, WA'], 180,
     'https://moonstone.ai', '{}'::jsonb),
    ('c1000003-0000-0000-0000-000000000003',
     'Nocturne Systems', ARRAY['Austin, TX', 'Remote'], 450,
     'https://nocturne.systems', '{}'::jsonb),
    ('c1000004-0000-0000-0000-000000000004',
     'Tidal Software', ARRAY['Portland, OR'], 220,
     'https://tidal.software', '{}'::jsonb),
    ('c1000005-0000-0000-0000-000000000005',
     'Eclipse Engineering', ARRAY['Denver, CO', 'Remote'], 380,
     'https://eclipse.engineering', '{}'::jsonb),
    ('c1000006-0000-0000-0000-000000000006',
     'The Werewolf Consultancy', ARRAY['Remote'], 45,
     'https://werewolf.consulting', '{"tagline": "We only take meetings after sunset"}'::jsonb),
    ('c1000007-0000-0000-0000-000000000007',
     'Cryptid Career Services', ARRAY['Remote', 'Pacific Northwest'], 28,
     'https://cryptid.careers', '{"tagline": "Bigfoot-verified employer", "sightings": 47}'::jsonb),
    ('c1000008-0000-0000-0000-000000000008',
     'Dreamweaver Digital', ARRAY['Los Angeles, CA'], 165,
     'https://dreamweaver.digital', '{}'::jsonb),

    -- Star-themed Companies (Khanh)
    ('c2000001-0000-0000-0000-000000000001',
     'Polaris Engineering', ARRAY['Boston, MA', 'Remote'], 520,
     'https://polaris.engineering', '{}'::jsonb),
    ('c2000002-0000-0000-0000-000000000002',
     'Constellation Cloud', ARRAY['Seattle, WA', 'New York, NY'], 890,
     'https://constellation.cloud', '{}'::jsonb),
    ('c2000003-0000-0000-0000-000000000003',
     'Nebula Dynamics', ARRAY['Austin, TX'], 340,
     'https://nebula.dynamics', '{}'::jsonb),
    ('c2000004-0000-0000-0000-000000000004',
     'Quasar Computing', ARRAY['San Jose, CA'], 670,
     'https://quasar.computing', '{}'::jsonb),
    ('c2000005-0000-0000-0000-000000000005',
     'Andromeda Systems', ARRAY['Remote'], 280,
     'https://andromeda.systems', '{}'::jsonb),
    ('c2000006-0000-0000-0000-000000000006',
     'Astrology.ai', ARRAY['Remote', 'Sedona, AZ'], 55,
     'https://astrology.ai', '{"tagline": "Mercury retrograde-aware deployments", "horoscope_driven_sprints": true}'::jsonb),
    ('c2000007-0000-0000-0000-000000000007',
     'Shooting Star Startups', ARRAY['San Francisco, CA'], 12,
     'https://shootingstar.vc', '{"tagline": "Move fast, burn bright, probably crash", "runway_months": 3}'::jsonb),
    ('c2000008-0000-0000-0000-000000000008',
     'Cosmic Raccoon Games', ARRAY['Los Angeles, CA', 'Remote'], 95,
     'https://cosmicraccoon.games', '{"mascot": "Cosmo the Space Raccoon"}'::jsonb),

    -- Sun-themed Companies (Baron)
    ('c3000001-0000-0000-0000-000000000001',
     'Solaris Technologies', ARRAY['Phoenix, AZ', 'Remote'], 780,
     'https://solaris.tech', '{}'::jsonb),
    ('c3000002-0000-0000-0000-000000000002',
     'Heliosphere Computing', ARRAY['San Diego, CA'], 420,
     'https://heliosphere.io', '{}'::jsonb),
    ('c3000003-0000-0000-0000-000000000003',
     'Dawn Protocol', ARRAY['Austin, TX', 'Remote'], 190,
     'https://dawn.protocol', '{}'::jsonb),
    ('c3000004-0000-0000-0000-000000000004',
     'Photon Labs', ARRAY['Boston, MA'], 560,
     'https://photon.labs', '{}'::jsonb),
    ('c3000005-0000-0000-0000-000000000005',
     'Corona Software', ARRAY['Denver, CO'], 340,
     'https://corona.software', '{"note": "Founded in 2018, unfortunate naming, great benefits"}'::jsonb),
    ('c3000006-0000-0000-0000-000000000006',
     'Sunburn Studios', ARRAY['Los Angeles, CA'], 75,
     'https://sunburn.games', '{"tagline": "Our crunch is legendary", "work_life_balance": "what balance?"}'::jsonb),
    ('c3000007-0000-0000-0000-000000000007',
     'Solar Flare Solutions', ARRAY['Remote'], 38,
     'https://solarflare.solutions', '{"tagline": "We break things at scale", "incident_count_2024": 847}'::jsonb),
    ('c3000008-0000-0000-0000-000000000008',
     'Daybreak Dynamics', ARRAY['Seattle, WA'], 290,
     'https://daybreak.dynamics', '{}'::jsonb),
    ('c3000009-0000-0000-0000-000000000009',
     'The Vitamin D Collective', ARRAY['Remote'], 22,
     'https://vitamind.dev', '{"tagline": "Touch grass optional", "fully_remote": true, "sunlight_encouraged": false}'::jsonb)

ON CONFLICT (company_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    locations = EXCLUDED.locations,
    size = EXCLUDED.size;


-- =========================
-- JOBS
-- =========================
INSERT INTO jobs (
    job_id, company_id, job_title, job_type,
    locations, posted_date, url, is_active, metadata
) VALUES
    -- Starlit Innovations
    ('d0000001-0000-0000-0000-000000000001',
     'c0000001-0000-0000-0000-000000000001',
     'Senior Software Engineer', 'full-time',
     ARRAY['San Francisco, CA'], DATE '2025-01-10',
     'https://starlit.dev/careers/senior-swe', true, '{}'::jsonb),

    ('d0000001-0000-0000-0000-000000000002',
     'c0000001-0000-0000-0000-000000000001',
     'Frontend Developer', 'full-time',
     ARRAY['Remote'], DATE '2025-01-15',
     'https://starlit.dev/careers/frontend', true, '{}'::jsonb),

    -- Selesine Systems
    ('d0000002-0000-0000-0000-000000000001',
     'c0000002-0000-0000-0000-000000000002',
     'Backend Engineer', 'full-time',
     ARRAY['Seattle, WA'], DATE '2025-01-12',
     'https://selesine.io/jobs/backend', true, '{}'::jsonb),

    -- Moonveil Labs
    ('d0000003-0000-0000-0000-000000000001',
     'c0000003-0000-0000-0000-000000000003',
     'Platform Engineer', 'full-time',
     ARRAY['Austin, TX'], DATE '2025-01-18',
     'https://moonveil.tech/careers/platform', true, '{}'::jsonb),

    ('d0000003-0000-0000-0000-000000000002',
     'c0000003-0000-0000-0000-000000000003',
     'DevOps Engineer', 'full-time',
     ARRAY['Remote'], DATE '2025-01-25',
     'https://moonveil.tech/careers/devops', true, '{}'::jsonb),

    -- Verdant Software
    ('d0000004-0000-0000-0000-000000000001',
     'c0000004-0000-0000-0000-000000000004',
     'Full Stack Developer', 'full-time',
     ARRAY['Portland, OR'], DATE '2025-01-20',
     'https://verdant.software/careers/fullstack', true, '{}'::jsonb),

    -- Obsidian Technologies
    ('d0000005-0000-0000-0000-000000000001',
     'c0000005-0000-0000-0000-000000000005',
     'Systems Architect', 'full-time',
     ARRAY['New York, NY'], DATE '2025-01-08',
     'https://obsidian.tech/jobs/systems-arch', true, '{}'::jsonb),

    ('d0000005-0000-0000-0000-000000000002',
     'c0000005-0000-0000-0000-000000000005',
     'Software Engineer II', 'full-time',
     ARRAY['New York, NY'], DATE '2025-02-01',
     'https://obsidian.tech/jobs/swe2', true, '{}'::jsonb),

    -- Prismatic AI
    ('d0000006-0000-0000-0000-000000000001',
     'c0000006-0000-0000-0000-000000000006',
     'ML Engineer', 'full-time',
     ARRAY['Boston, MA'], DATE '2025-01-22',
     'https://prismatic.ai/careers/ml-eng', true, '{}'::jsonb),

    ('d0000006-0000-0000-0000-000000000002',
     'c0000006-0000-0000-0000-000000000006',
     'Data Scientist', 'full-time',
     ARRAY['Remote'], DATE '2025-02-05',
     'https://prismatic.ai/careers/data-sci', true, '{}'::jsonb),

    -- Emberheart Games
    ('d0000007-0000-0000-0000-000000000001',
     'c0000007-0000-0000-0000-000000000007',
     'Game Developer', 'full-time',
     ARRAY['Los Angeles, CA'], DATE '2025-01-28',
     'https://emberheart.games/jobs/game-dev', true, '{}'::jsonb),

    -- Frostbyte Computing
    ('d0000008-0000-0000-0000-000000000001',
     'c0000008-0000-0000-0000-000000000008',
     'Cloud Infrastructure Engineer', 'full-time',
     ARRAY['Denver, CO'], DATE '2025-02-01',
     'https://frostbyte.dev/careers/cloud-infra', true, '{}'::jsonb),

    -- Wanderlust Digital
    ('d0000009-0000-0000-0000-000000000001',
     'c0000009-0000-0000-0000-000000000009',
     'Remote Backend Developer', 'contract',
     ARRAY['Remote'], DATE '2025-02-08',
     'https://wanderlust.digital/jobs/backend', true, '{}'::jsonb),

    -- Silverwind Consulting
    ('d0000010-0000-0000-0000-000000000001',
     'c0000010-0000-0000-0000-000000000010',
     'Solutions Engineer', 'full-time',
     ARRAY['Chicago, IL'], DATE '2025-01-30',
     'https://silverwind.co/careers/solutions', true, '{}'::jsonb),

    -- Celestine Data
    ('d0000011-0000-0000-0000-000000000001',
     'c0000011-0000-0000-0000-000000000011',
     'Data Engineer', 'full-time',
     ARRAY['San Jose, CA'], DATE '2025-02-10',
     'https://celestine.data/jobs/data-eng', true, '{}'::jsonb),

    -- Aethon Cloud
    ('d0000012-0000-0000-0000-000000000001',
     'c0000012-0000-0000-0000-000000000012',
     'Site Reliability Engineer', 'full-time',
     ARRAY['Seattle, WA'], DATE '2025-02-05',
     'https://aethon.cloud/careers/sre', true, '{}'::jsonb),

    ('d0000012-0000-0000-0000-000000000002',
     'c0000012-0000-0000-0000-000000000012',
     'Platform Architect', 'full-time',
     ARRAY['Remote'], DATE '2025-02-15',
     'https://aethon.cloud/careers/platform-arch', true, '{}'::jsonb),

    -- Lumina Analytics
    ('d0000013-0000-0000-0000-000000000001',
     'c0000013-0000-0000-0000-000000000013',
     'Analytics Engineer', 'full-time',
     ARRAY['New York, NY'], DATE '2025-02-12',
     'https://lumina.io/jobs/analytics-eng', true, '{}'::jsonb),

    -- Solstice Labs
    ('d0000014-0000-0000-0000-000000000001',
     'c0000014-0000-0000-0000-000000000014',
     'Research Engineer', 'full-time',
     ARRAY['Austin, TX'], DATE '2025-02-18',
     'https://solstice.labs/careers/research', true, '{}'::jsonb),

    -- Starbucks (the one that matters)
    ('d0000015-0000-0000-0000-000000000001',
     'c0000015-0000-0000-0000-000000000015',
     'Barista (Not Software)', 'part-time',
     ARRAY['Seattle, WA'], DATE '2025-02-20',
     'https://starbucks.com/careers/barista', true,
     '{"note": "This is for making coffee, not code"}'::jsonb),

    -- Moon-themed Jobs (Rosalia)
    ('d1000001-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000001',
     'Senior Software Engineer', 'full-time', ARRAY['San Francisco, CA'], DATE '2025-03-01',
     'https://lunaria.dev/careers/senior-swe', true, '{}'::jsonb),
    ('d1000001-0000-0000-0000-000000000002', 'c1000001-0000-0000-0000-000000000001',
     'Backend Developer', 'full-time', ARRAY['Remote'], DATE '2025-03-05',
     'https://lunaria.dev/careers/backend', true, '{}'::jsonb),
    ('d1000002-0000-0000-0000-000000000001', 'c1000002-0000-0000-0000-000000000002',
     'Data Engineer', 'full-time', ARRAY['Seattle, WA'], DATE '2025-03-02',
     'https://moonstone.ai/jobs/data-eng', true, '{}'::jsonb),
    ('d1000002-0000-0000-0000-000000000002', 'c1000002-0000-0000-0000-000000000002',
     'Backend Developer', 'full-time', ARRAY['Seattle, WA'], DATE '2025-03-04',
     'https://moonstone.ai/jobs/backend', true, '{}'::jsonb),
    ('d1000003-0000-0000-0000-000000000001', 'c1000003-0000-0000-0000-000000000003',
     'Platform Engineer', 'full-time', ARRAY['Austin, TX'], DATE '2025-03-03',
     'https://nocturne.systems/careers/platform', true, '{}'::jsonb),
    ('d1000004-0000-0000-0000-000000000001', 'c1000004-0000-0000-0000-000000000004',
     'Full Stack Developer', 'full-time', ARRAY['Portland, OR'], DATE '2025-03-04',
     'https://tidal.software/jobs/fullstack', true, '{}'::jsonb),
    ('d1000005-0000-0000-0000-000000000001', 'c1000005-0000-0000-0000-000000000005',
     'DevOps Engineer', 'full-time', ARRAY['Denver, CO'], DATE '2025-03-05',
     'https://eclipse.engineering/careers/devops', true, '{}'::jsonb),
    ('d1000005-0000-0000-0000-000000000002', 'c1000005-0000-0000-0000-000000000005',
     'Site Reliability Engineer', 'full-time', ARRAY['Remote'], DATE '2025-03-08',
     'https://eclipse.engineering/careers/sre', true, '{}'::jsonb),
    ('d1000006-0000-0000-0000-000000000001', 'c1000006-0000-0000-0000-000000000006',
     'Nocturnal Software Consultant', 'contract', ARRAY['Remote'], DATE '2025-03-06',
     'https://werewolf.consulting/howl-with-us', true,
     '{"shift": "night", "full_moon_bonus": true}'::jsonb),
    ('d1000007-0000-0000-0000-000000000001', 'c1000007-0000-0000-0000-000000000007',
     'Mysterious Backend Developer', 'full-time', ARRAY['Remote'], DATE '2025-03-07',
     'https://cryptid.careers/jobs/backend', true,
     '{"clearance": "sasquatch-level", "nda_required": true}'::jsonb),
    ('d1000008-0000-0000-0000-000000000001', 'c1000008-0000-0000-0000-000000000008',
     'Frontend Engineer', 'full-time', ARRAY['Los Angeles, CA'], DATE '2025-03-08',
     'https://dreamweaver.digital/careers/frontend', true, '{}'::jsonb),

    -- Star-themed Jobs (Khanh)
    ('d2000001-0000-0000-0000-000000000001', 'c2000001-0000-0000-0000-000000000001',
     'Staff Engineer', 'full-time', ARRAY['Boston, MA'], DATE '2025-03-01',
     'https://polaris.engineering/careers/staff', true, '{}'::jsonb),
    ('d2000001-0000-0000-0000-000000000002', 'c2000001-0000-0000-0000-000000000001',
     'Systems Architect', 'full-time', ARRAY['Remote'], DATE '2025-03-04',
     'https://polaris.engineering/careers/architect', true, '{}'::jsonb),
    ('d2000002-0000-0000-0000-000000000001', 'c2000002-0000-0000-0000-000000000002',
     'Cloud Engineer', 'full-time', ARRAY['Seattle, WA'], DATE '2025-03-02',
     'https://constellation.cloud/jobs/cloud-eng', true, '{}'::jsonb),
    ('d2000003-0000-0000-0000-000000000001', 'c2000003-0000-0000-0000-000000000003',
     'ML Engineer', 'full-time', ARRAY['Austin, TX'], DATE '2025-03-03',
     'https://nebula.dynamics/careers/ml', true, '{}'::jsonb),
    ('d2000004-0000-0000-0000-000000000001', 'c2000004-0000-0000-0000-000000000004',
     'Performance Engineer', 'full-time', ARRAY['San Jose, CA'], DATE '2025-03-04',
     'https://quasar.computing/jobs/perf', true, '{}'::jsonb),
    ('d2000005-0000-0000-0000-000000000001', 'c2000005-0000-0000-0000-000000000005',
     'Remote Backend Lead', 'full-time', ARRAY['Remote'], DATE '2025-03-05',
     'https://andromeda.systems/careers/backend-lead', true, '{}'::jsonb),
    ('d2000006-0000-0000-0000-000000000001', 'c2000006-0000-0000-0000-000000000006',
     'Horoscope Algorithm Engineer', 'full-time', ARRAY['Remote'], DATE '2025-03-06',
     'https://astrology.ai/careers/horoscope-eng', true,
     '{"required": "must know your rising sign", "bonus": "moon in tech-friendly house"}'::jsonb),
    ('d2000007-0000-0000-0000-000000000001', 'c2000007-0000-0000-0000-000000000007',
     'Founding Engineer (We Swear We Have Funding)', 'full-time', ARRAY['San Francisco, CA'], DATE '2025-03-07',
     'https://shootingstar.vc/jobs/founding', true,
     '{"equity": "generous", "salary": "not so much", "runway": "pray"}'::jsonb),
    ('d2000008-0000-0000-0000-000000000001', 'c2000008-0000-0000-0000-000000000008',
     'Game Developer', 'full-time', ARRAY['Los Angeles, CA'], DATE '2025-03-08',
     'https://cosmicraccoon.games/jobs/game-dev', true,
     '{"mascot_meetings": "mandatory", "trash_panda_appreciation": "required"}'::jsonb),

    -- Sun-themed Jobs (Baron)
    ('d3000001-0000-0000-0000-000000000001', 'c3000001-0000-0000-0000-000000000001',
     'Principal Engineer', 'full-time', ARRAY['Phoenix, AZ'], DATE '2025-03-01',
     'https://solaris.tech/careers/principal', true, '{}'::jsonb),
    ('d3000001-0000-0000-0000-000000000002', 'c3000001-0000-0000-0000-000000000001',
     'Backend Developer', 'full-time', ARRAY['Remote'], DATE '2025-03-04',
     'https://solaris.tech/careers/backend', true, '{}'::jsonb),
    ('d3000002-0000-0000-0000-000000000001', 'c3000002-0000-0000-0000-000000000002',
     'Infrastructure Engineer', 'full-time', ARRAY['San Diego, CA'], DATE '2025-03-02',
     'https://heliosphere.io/jobs/infra', true, '{}'::jsonb),
    ('d3000003-0000-0000-0000-000000000001', 'c3000003-0000-0000-0000-000000000003',
     'Blockchain Developer', 'full-time', ARRAY['Austin, TX'], DATE '2025-03-03',
     'https://dawn.protocol/careers/blockchain', true, '{}'::jsonb),
    ('d3000004-0000-0000-0000-000000000001', 'c3000004-0000-0000-0000-000000000004',
     'Research Engineer', 'full-time', ARRAY['Boston, MA'], DATE '2025-03-04',
     'https://photon.labs/jobs/research', true, '{}'::jsonb),
    ('d3000005-0000-0000-0000-000000000001', 'c3000005-0000-0000-0000-000000000005',
     'Senior Developer', 'full-time', ARRAY['Denver, CO'], DATE '2025-03-05',
     'https://corona.software/careers/senior', true,
     '{"note": "Yes we know about the name. No we are not rebranding."}'::jsonb),
    ('d3000006-0000-0000-0000-000000000001', 'c3000006-0000-0000-0000-000000000006',
     'Game Developer (Crunch Resistant)', 'full-time', ARRAY['Los Angeles, CA'], DATE '2025-03-06',
     'https://sunburn.games/jobs/game-dev', true,
     '{"warning": "crunch is inevitable", "pizza_fridays": true}'::jsonb),
    ('d3000007-0000-0000-0000-000000000001', 'c3000007-0000-0000-0000-000000000007',
     'Chaos Engineer', 'full-time', ARRAY['Remote'], DATE '2025-03-07',
     'https://solarflare.solutions/jobs/chaos', true,
     '{"job_security": "low", "excitement": "high", "pager_duty": "constant"}'::jsonb),
    ('d3000008-0000-0000-0000-000000000001', 'c3000008-0000-0000-0000-000000000008',
     'Platform Engineer', 'full-time', ARRAY['Seattle, WA'], DATE '2025-03-08',
     'https://daybreak.dynamics/careers/platform', true, '{}'::jsonb),
    ('d3000009-0000-0000-0000-000000000001', 'c3000009-0000-0000-0000-000000000009',
     'Fully Remote Developer', 'full-time', ARRAY['Remote'], DATE '2025-03-09',
     'https://vitamind.dev/jobs/remote', true,
     '{"sunlight_requirement": "none", "vampire_friendly": true}'::jsonb)

ON CONFLICT (job_id) DO UPDATE SET
    job_title = EXCLUDED.job_title,
    metadata = EXCLUDED.metadata;


-- =========================
-- ROSALIA'S APPLICATIONS
-- User: 102182222430157775253
-- Theme: Mostly rejections, one glorious Starbucks barista offer
-- =========================
INSERT INTO applications (
    application_id, user_id, job_id,
    application_date, final_outcome, date_updated,
    position_title, metadata
) VALUES
    -- Rejections (the software journey)
    ('a0000001-0001-0000-0000-000000000001',
     '102182222430157775253',
     'd0000001-0000-0000-0000-000000000001',
     DATE '2025-01-15', 'rejected', DATE '2025-02-01',
     'Senior Software Engineer', '{}'::jsonb),

    ('a0000001-0002-0000-0000-000000000001',
     '102182222430157775253',
     'd0000002-0000-0000-0000-000000000001',
     DATE '2025-01-18', 'rejected', DATE '2025-02-05',
     'Backend Engineer', '{}'::jsonb),

    ('a0000001-0003-0000-0000-000000000001',
     '102182222430157775253',
     'd0000003-0000-0000-0000-000000000001',
     DATE '2025-01-22', 'rejected', DATE '2025-02-10',
     'Platform Engineer', '{}'::jsonb),

    ('a0000001-0004-0000-0000-000000000001',
     '102182222430157775253',
     'd0000005-0000-0000-0000-000000000001',
     DATE '2025-01-12', 'rejected', DATE '2025-01-28',
     'Systems Architect', '{}'::jsonb),

    ('a0000001-0005-0000-0000-000000000001',
     '102182222430157775253',
     'd0000006-0000-0000-0000-000000000001',
     DATE '2025-01-25', 'rejected', DATE '2025-02-15',
     'ML Engineer', '{}'::jsonb),

    ('a0000001-0006-0000-0000-000000000001',
     '102182222430157775253',
     'd0000007-0000-0000-0000-000000000001',
     DATE '2025-02-01', 'rejected', DATE '2025-02-20',
     'Game Developer', '{}'::jsonb),

    ('a0000001-0007-0000-0000-000000000001',
     '102182222430157775253',
     'd0000008-0000-0000-0000-000000000001',
     DATE '2025-02-05', 'rejected', DATE '2025-02-25',
     'Cloud Infrastructure Engineer', '{}'::jsonb),

    ('a0000001-0008-0000-0000-000000000001',
     '102182222430157775253',
     'd0000011-0000-0000-0000-000000000001',
     DATE '2025-02-12', 'rejected', DATE '2025-03-01',
     'Data Engineer', '{}'::jsonb),

    ('a0000001-0009-0000-0000-000000000001',
     '102182222430157775253',
     'd0000012-0000-0000-0000-000000000001',
     DATE '2025-02-08', 'rejected', DATE '2025-02-28',
     'Site Reliability Engineer', '{}'::jsonb),

    ('a0000001-0010-0000-0000-000000000001',
     '102182222430157775253',
     'd0000013-0000-0000-0000-000000000001',
     DATE '2025-02-15', 'rejected', DATE '2025-03-05',
     'Analytics Engineer', '{}'::jsonb),

    -- Pending applications (still hoping)
    ('a0000001-0011-0000-0000-000000000001',
     '102182222430157775253',
     'd0000014-0000-0000-0000-000000000001',
     DATE '2025-02-20', 'pending', DATE '2025-03-01',
     'Research Engineer', '{}'::jsonb),

    ('a0000001-0012-0000-0000-000000000001',
     '102182222430157775253',
     'd0000004-0000-0000-0000-000000000001',
     DATE '2025-02-22', 'pending', DATE '2025-03-05',
     'Full Stack Developer', '{}'::jsonb),

    -- THE ONE SUCCESS: Starbucks Barista
    ('a0000001-0013-0000-0000-000000000001',
     '102182222430157775253',
     'd0000015-0000-0000-0000-000000000001',
     DATE '2025-02-25', 'offer', DATE '2025-03-10',
     'Barista (Not Software)',
     '{"clarification": "This is for making coffee, not writing code", "latte_art_potential": "promising"}'::jsonb)

ON CONFLICT (user_id, job_id) DO UPDATE SET
    final_outcome = EXCLUDED.final_outcome,
    date_updated = EXCLUDED.date_updated,
    metadata = EXCLUDED.metadata;

-- Rosalia's Moon-themed Applications (20 additional apps)
INSERT INTO applications (application_id, user_id, job_id, application_date, final_outcome, date_updated, position_title, metadata) VALUES
    -- Offers (3)
    ('a1000001-0001-0000-0000-000000000001', '102182222430157775253', 'd1000001-0000-0000-0000-000000000001',
     DATE '2025-03-05', 'offer', DATE '2025-04-01', 'Senior Software Engineer',
     '{"excitement": "finally a tech offer!"}'::jsonb),
    ('a1000001-0002-0000-0000-000000000001', '102182222430157775253', 'd1000003-0000-0000-0000-000000000001',
     DATE '2025-03-08', 'offer', DATE '2025-04-05', 'Platform Engineer', '{}'::jsonb),
    ('a1000001-0003-0000-0000-000000000001', '102182222430157775253', 'd1000006-0000-0000-0000-000000000001',
     DATE '2025-03-10', 'offer', DATE '2025-04-08', 'Nocturnal Software Consultant',
     '{"note": "They loved my night owl tendencies"}'::jsonb),

    -- Rejections at various stages (8)
    ('a1000001-0004-0000-0000-000000000001', '102182222430157775253', 'd1000002-0000-0000-0000-000000000002',
     DATE '2025-03-06', 'rejected', DATE '2025-03-15', 'Backend Developer', '{}'::jsonb),
    ('a1000001-0005-0000-0000-000000000001', '102182222430157775253', 'd1000004-0000-0000-0000-000000000001',
     DATE '2025-03-07', 'rejected', DATE '2025-03-20', 'Full Stack Developer', '{}'::jsonb),
    ('a1000001-0006-0000-0000-000000000001', '102182222430157775253', 'd1000005-0000-0000-0000-000000000001',
     DATE '2025-03-09', 'rejected', DATE '2025-03-25', 'DevOps Engineer', '{}'::jsonb),
    ('a1000001-0007-0000-0000-000000000001', '102182222430157775253', 'd1000005-0000-0000-0000-000000000002',
     DATE '2025-03-11', 'rejected', DATE '2025-03-28', 'Site Reliability Engineer', '{}'::jsonb),
    ('a1000001-0008-0000-0000-000000000001', '102182222430157775253', 'd1000007-0000-0000-0000-000000000001',
     DATE '2025-03-12', 'rejected', DATE '2025-03-30', 'Mysterious Backend Developer',
     '{"reason": "Failed Bigfoot sighting verification"}'::jsonb),
    ('a1000001-0009-0000-0000-000000000001', '102182222430157775253', 'd1000008-0000-0000-0000-000000000001',
     DATE '2025-03-13', 'rejected', DATE '2025-04-01', 'Frontend Engineer', '{}'::jsonb),
    ('a1000001-0010-0000-0000-000000000001', '102182222430157775253', 'd2000001-0000-0000-0000-000000000001',
     DATE '2025-03-14', 'rejected', DATE '2025-04-02', 'Staff Engineer', '{}'::jsonb),
    ('a1000001-0011-0000-0000-000000000001', '102182222430157775253', 'd3000001-0000-0000-0000-000000000001',
     DATE '2025-03-15', 'rejected', DATE '2025-04-03', 'Principal Engineer', '{}'::jsonb),

    -- Pending at various stages (6)
    ('a1000001-0012-0000-0000-000000000001', '102182222430157775253', 'd1000002-0000-0000-0000-000000000001',
     DATE '2025-03-20', 'pending', DATE '2025-04-01', 'Data Engineer', '{}'::jsonb),
    ('a1000001-0013-0000-0000-000000000001', '102182222430157775253', 'd2000002-0000-0000-0000-000000000001',
     DATE '2025-03-21', 'pending', DATE '2025-04-02', 'Cloud Engineer', '{}'::jsonb),
    ('a1000001-0014-0000-0000-000000000001', '102182222430157775253', 'd2000003-0000-0000-0000-000000000001',
     DATE '2025-03-22', 'pending', DATE '2025-04-03', 'ML Engineer', '{}'::jsonb),
    ('a1000001-0015-0000-0000-000000000001', '102182222430157775253', 'd3000002-0000-0000-0000-000000000001',
     DATE '2025-03-23', 'pending', DATE '2025-04-04', 'Infrastructure Engineer', '{}'::jsonb),
    ('a1000001-0016-0000-0000-000000000001', '102182222430157775253', 'd3000003-0000-0000-0000-000000000001',
     DATE '2025-03-24', 'pending', DATE '2025-04-05', 'Blockchain Developer', '{}'::jsonb),
    ('a1000001-0017-0000-0000-000000000001', '102182222430157775253', 'd3000008-0000-0000-0000-000000000001',
     DATE '2025-03-25', 'pending', DATE '2025-04-06', 'Platform Engineer', '{}'::jsonb),

    -- Withdrawn (3)
    ('a1000001-0018-0000-0000-000000000001', '102182222430157775253', 'd2000006-0000-0000-0000-000000000001',
     DATE '2025-03-16', 'withdrawn', DATE '2025-03-22', 'Horoscope Algorithm Engineer',
     '{"reason": "Mercury was in retrograde during the OA"}'::jsonb),
    ('a1000001-0019-0000-0000-000000000001', '102182222430157775253', 'd2000007-0000-0000-0000-000000000001',
     DATE '2025-03-17', 'withdrawn', DATE '2025-03-23', 'Founding Engineer (We Swear We Have Funding)',
     '{"reason": "Checked their runway. Yikes."}'::jsonb),
    ('a1000001-0020-0000-0000-000000000001', '102182222430157775253', 'd3000007-0000-0000-0000-000000000001',
     DATE '2025-03-18', 'withdrawn', DATE '2025-03-24', 'Chaos Engineer',
     '{"reason": "Too much chaos for me"}'::jsonb)
ON CONFLICT (user_id, job_id) DO UPDATE SET final_outcome = EXCLUDED.final_outcome, metadata = EXCLUDED.metadata;


-- =========================
-- BARON S'S APPLICATIONS
-- User: 106077827475034522998
-- Theme: Mixed results (recruiter perspective, sees the industry)
-- =========================
INSERT INTO applications (
    application_id, user_id, job_id,
    application_date, final_outcome, date_updated,
    position_title, metadata
) VALUES
    -- Offers
    ('a0000002-0001-0000-0000-000000000001',
     '106077827475034522998',
     'd0000001-0000-0000-0000-000000000002',
     DATE '2025-01-20', 'offer', DATE '2025-02-15',
     'Frontend Developer', '{}'::jsonb),

    ('a0000002-0002-0000-0000-000000000001',
     '106077827475034522998',
     'd0000010-0000-0000-0000-000000000001',
     DATE '2025-02-02', 'offer', DATE '2025-03-01',
     'Solutions Engineer', '{}'::jsonb),

    -- Rejections
    ('a0000002-0003-0000-0000-000000000001',
     '106077827475034522998',
     'd0000005-0000-0000-0000-000000000002',
     DATE '2025-02-05', 'rejected', DATE '2025-02-20',
     'Software Engineer II', '{}'::jsonb),

    ('a0000002-0004-0000-0000-000000000001',
     '106077827475034522998',
     'd0000003-0000-0000-0000-000000000002',
     DATE '2025-01-28', 'rejected', DATE '2025-02-12',
     'DevOps Engineer', '{}'::jsonb),

    ('a0000002-0005-0000-0000-000000000001',
     '106077827475034522998',
     'd0000006-0000-0000-0000-000000000002',
     DATE '2025-02-08', 'rejected', DATE '2025-02-28',
     'Data Scientist', '{}'::jsonb),

    -- Withdrawn
    ('a0000002-0006-0000-0000-000000000001',
     '106077827475034522998',
     'd0000009-0000-0000-0000-000000000001',
     DATE '2025-02-12', 'withdrawn', DATE '2025-02-25',
     'Remote Backend Developer', '{}'::jsonb),

    -- Pending
    ('a0000002-0007-0000-0000-000000000001',
     '106077827475034522998',
     'd0000012-0000-0000-0000-000000000002',
     DATE '2025-02-18', 'pending', DATE '2025-03-05',
     'Platform Architect', '{}'::jsonb),

    ('a0000002-0008-0000-0000-000000000001',
     '106077827475034522998',
     'd0000014-0000-0000-0000-000000000001',
     DATE '2025-02-22', 'pending', DATE '2025-03-08',
     'Research Engineer', '{}'::jsonb)

ON CONFLICT (user_id, job_id) DO UPDATE SET
    final_outcome = EXCLUDED.final_outcome,
    date_updated = EXCLUDED.date_updated,
    metadata = EXCLUDED.metadata;

-- Baron's Sun-themed Applications (20 additional apps)
INSERT INTO applications (application_id, user_id, job_id, application_date, final_outcome, date_updated, position_title, metadata) VALUES
    -- Offers (4)
    ('a3000001-0001-0000-0000-000000000001', '106077827475034522998', 'd3000001-0000-0000-0000-000000000001',
     DATE '2025-03-05', 'offer', DATE '2025-04-01', 'Principal Engineer', '{}'::jsonb),
    ('a3000001-0002-0000-0000-000000000001', '106077827475034522998', 'd3000002-0000-0000-0000-000000000001',
     DATE '2025-03-06', 'offer', DATE '2025-04-02', 'Infrastructure Engineer', '{}'::jsonb),
    ('a3000001-0003-0000-0000-000000000001', '106077827475034522998', 'd3000004-0000-0000-0000-000000000001',
     DATE '2025-03-07', 'offer', DATE '2025-04-03', 'Research Engineer', '{}'::jsonb),
    ('a3000001-0004-0000-0000-000000000001', '106077827475034522998', 'd3000008-0000-0000-0000-000000000001',
     DATE '2025-03-08', 'offer', DATE '2025-04-04', 'Platform Engineer', '{}'::jsonb),

    -- Rejections (7)
    ('a3000001-0005-0000-0000-000000000001', '106077827475034522998', 'd3000003-0000-0000-0000-000000000001',
     DATE '2025-03-09', 'rejected', DATE '2025-03-24', 'Blockchain Developer',
     '{"reason": "Did not believe in the protocol enough"}'::jsonb),
    ('a3000001-0006-0000-0000-000000000001', '106077827475034522998', 'd3000005-0000-0000-0000-000000000001',
     DATE '2025-03-10', 'rejected', DATE '2025-03-25', 'Senior Developer', '{}'::jsonb),
    ('a3000001-0007-0000-0000-000000000001', '106077827475034522998', 'd3000006-0000-0000-0000-000000000001',
     DATE '2025-03-11', 'rejected', DATE '2025-03-26', 'Game Developer (Crunch Resistant)',
     '{"reason": "Valued work-life balance too much"}'::jsonb),
    ('a3000001-0008-0000-0000-000000000001', '106077827475034522998', 'd3000007-0000-0000-0000-000000000001',
     DATE '2025-03-12', 'rejected', DATE '2025-03-27', 'Chaos Engineer',
     '{"reason": "Not chaotic enough"}'::jsonb),
    ('a3000001-0009-0000-0000-000000000001', '106077827475034522998', 'd3000009-0000-0000-0000-000000000001',
     DATE '2025-03-13', 'rejected', DATE '2025-03-28', 'Fully Remote Developer',
     '{"reason": "Too much vitamin D already"}'::jsonb),
    ('a3000001-0010-0000-0000-000000000001', '106077827475034522998', 'd1000003-0000-0000-0000-000000000001',
     DATE '2025-03-14', 'rejected', DATE '2025-03-29', 'Platform Engineer', '{}'::jsonb),
    ('a3000001-0011-0000-0000-000000000001', '106077827475034522998', 'd2000005-0000-0000-0000-000000000001',
     DATE '2025-03-15', 'rejected', DATE '2025-03-30', 'Remote Backend Lead', '{}'::jsonb),

    -- Pending (6)
    ('a3000001-0012-0000-0000-000000000001', '106077827475034522998', 'd3000001-0000-0000-0000-000000000002',
     DATE '2025-03-20', 'pending', DATE '2025-04-01', 'Backend Developer', '{}'::jsonb),
    ('a3000001-0013-0000-0000-000000000001', '106077827475034522998', 'd1000001-0000-0000-0000-000000000001',
     DATE '2025-03-21', 'pending', DATE '2025-04-02', 'Senior Software Engineer', '{}'::jsonb),
    ('a3000001-0014-0000-0000-000000000001', '106077827475034522998', 'd1000002-0000-0000-0000-000000000001',
     DATE '2025-03-22', 'pending', DATE '2025-04-03', 'Data Engineer', '{}'::jsonb),
    ('a3000001-0015-0000-0000-000000000001', '106077827475034522998', 'd2000001-0000-0000-0000-000000000001',
     DATE '2025-03-23', 'pending', DATE '2025-04-04', 'Staff Engineer', '{}'::jsonb),
    ('a3000001-0016-0000-0000-000000000001', '106077827475034522998', 'd2000003-0000-0000-0000-000000000001',
     DATE '2025-03-24', 'pending', DATE '2025-04-05', 'ML Engineer', '{}'::jsonb),
    ('a3000001-0017-0000-0000-000000000001', '106077827475034522998', 'd2000004-0000-0000-0000-000000000001',
     DATE '2025-03-25', 'pending', DATE '2025-04-06', 'Performance Engineer', '{}'::jsonb),

    -- Withdrawn (3)
    ('a3000001-0018-0000-0000-000000000001', '106077827475034522998', 'd2000006-0000-0000-0000-000000000001',
     DATE '2025-03-16', 'withdrawn', DATE '2025-03-22', 'Horoscope Algorithm Engineer',
     '{"reason": "Scorpio rising was not compatible with team Sagittarius"}'::jsonb),
    ('a3000001-0019-0000-0000-000000000001', '106077827475034522998', 'd2000007-0000-0000-0000-000000000001',
     DATE '2025-03-17', 'withdrawn', DATE '2025-03-23', 'Founding Engineer (We Swear We Have Funding)',
     '{"reason": "Asked for proof of funding. They cried."}'::jsonb),
    ('a3000001-0020-0000-0000-000000000001', '106077827475034522998', 'd1000006-0000-0000-0000-000000000001',
     DATE '2025-03-18', 'withdrawn', DATE '2025-03-24', 'Nocturnal Software Consultant',
     '{"reason": "I am a morning person"}'::jsonb)
ON CONFLICT (user_id, job_id) DO UPDATE SET final_outcome = EXCLUDED.final_outcome, metadata = EXCLUDED.metadata;


-- =========================
-- KHANH NGUYEN'S APPLICATIONS
-- User: 113198465471291118912
-- Theme: Slightly more successes (techno_warlord energy)
-- =========================
INSERT INTO applications (
    application_id, user_id, job_id,
    application_date, final_outcome, date_updated,
    position_title, metadata
) VALUES
    -- Offers (more successes)
    ('a0000003-0001-0000-0000-000000000001',
     '113198465471291118912',
     'd0000001-0000-0000-0000-000000000001',
     DATE '2025-01-18', 'offer', DATE '2025-02-10',
     'Senior Software Engineer', '{}'::jsonb),

    ('a0000003-0002-0000-0000-000000000001',
     '113198465471291118912',
     'd0000003-0000-0000-0000-000000000001',
     DATE '2025-01-25', 'offer', DATE '2025-02-18',
     'Platform Engineer', '{}'::jsonb),

    ('a0000003-0003-0000-0000-000000000001',
     '113198465471291118912',
     'd0000012-0000-0000-0000-000000000001',
     DATE '2025-02-10', 'offer', DATE '2025-03-05',
     'Site Reliability Engineer', '{}'::jsonb),

    -- Rejections (still some)
    ('a0000003-0004-0000-0000-000000000001',
     '113198465471291118912',
     'd0000005-0000-0000-0000-000000000001',
     DATE '2025-01-15', 'rejected', DATE '2025-02-01',
     'Systems Architect', '{}'::jsonb),

    ('a0000003-0005-0000-0000-000000000001',
     '113198465471291118912',
     'd0000006-0000-0000-0000-000000000001',
     DATE '2025-01-28', 'rejected', DATE '2025-02-15',
     'ML Engineer', '{}'::jsonb),

    -- Withdrawn
    ('a0000003-0006-0000-0000-000000000001',
     '113198465471291118912',
     'd0000007-0000-0000-0000-000000000001',
     DATE '2025-02-05', 'withdrawn', DATE '2025-02-18',
     'Game Developer', '{}'::jsonb),

    -- Pending
    ('a0000003-0007-0000-0000-000000000001',
     '113198465471291118912',
     'd0000008-0000-0000-0000-000000000001',
     DATE '2025-02-12', 'pending', DATE '2025-03-01',
     'Cloud Infrastructure Engineer', '{}'::jsonb),

    ('a0000003-0008-0000-0000-000000000001',
     '113198465471291118912',
     'd0000011-0000-0000-0000-000000000001',
     DATE '2025-02-15', 'pending', DATE '2025-03-05',
     'Data Engineer', '{}'::jsonb),

    ('a0000003-0009-0000-0000-000000000001',
     '113198465471291118912',
     'd0000013-0000-0000-0000-000000000001',
     DATE '2025-02-18', 'pending', DATE '2025-03-08',
     'Analytics Engineer', '{}'::jsonb)

ON CONFLICT (user_id, job_id) DO UPDATE SET
    final_outcome = EXCLUDED.final_outcome,
    date_updated = EXCLUDED.date_updated,
    metadata = EXCLUDED.metadata;

-- Khanh's Star-themed Applications (20 additional apps)
INSERT INTO applications (application_id, user_id, job_id, application_date, final_outcome, date_updated, position_title, metadata) VALUES
    -- Offers (5)
    ('a2000001-0001-0000-0000-000000000001', '113198465471291118912', 'd2000001-0000-0000-0000-000000000001',
     DATE '2025-03-05', 'offer', DATE '2025-04-01', 'Staff Engineer', '{}'::jsonb),
    ('a2000001-0002-0000-0000-000000000001', '113198465471291118912', 'd2000002-0000-0000-0000-000000000001',
     DATE '2025-03-06', 'offer', DATE '2025-04-02', 'Cloud Engineer', '{}'::jsonb),
    ('a2000001-0003-0000-0000-000000000001', '113198465471291118912', 'd2000003-0000-0000-0000-000000000001',
     DATE '2025-03-07', 'offer', DATE '2025-04-03', 'ML Engineer', '{}'::jsonb),
    ('a2000001-0004-0000-0000-000000000001', '113198465471291118912', 'd2000004-0000-0000-0000-000000000001',
     DATE '2025-03-08', 'offer', DATE '2025-04-04', 'Performance Engineer', '{}'::jsonb),
    ('a2000001-0005-0000-0000-000000000001', '113198465471291118912', 'd2000006-0000-0000-0000-000000000001',
     DATE '2025-03-09', 'offer', DATE '2025-04-05', 'Horoscope Algorithm Engineer',
     '{"note": "Rising sign was perfect for the role"}'::jsonb),

    -- Rejections (6)
    ('a2000001-0006-0000-0000-000000000001', '113198465471291118912', 'd2000005-0000-0000-0000-000000000001',
     DATE '2025-03-10', 'rejected', DATE '2025-03-25', 'Remote Backend Lead', '{}'::jsonb),
    ('a2000001-0007-0000-0000-000000000001', '113198465471291118912', 'd2000007-0000-0000-0000-000000000001',
     DATE '2025-03-11', 'rejected', DATE '2025-03-26', 'Founding Engineer (We Swear We Have Funding)',
     '{"note": "They ran out of funding mid-interview"}'::jsonb),
    ('a2000001-0008-0000-0000-000000000001', '113198465471291118912', 'd2000008-0000-0000-0000-000000000001',
     DATE '2025-03-12', 'rejected', DATE '2025-03-27', 'Game Developer',
     '{"reason": "Did not appreciate Cosmo enough"}'::jsonb),
    ('a2000001-0009-0000-0000-000000000001', '113198465471291118912', 'd1000001-0000-0000-0000-000000000001',
     DATE '2025-03-13', 'rejected', DATE '2025-03-28', 'Senior Software Engineer', '{}'::jsonb),
    ('a2000001-0010-0000-0000-000000000001', '113198465471291118912', 'd1000004-0000-0000-0000-000000000001',
     DATE '2025-03-14', 'rejected', DATE '2025-03-29', 'Full Stack Developer', '{}'::jsonb),
    ('a2000001-0011-0000-0000-000000000001', '113198465471291118912', 'd3000006-0000-0000-0000-000000000001',
     DATE '2025-03-15', 'rejected', DATE '2025-03-30', 'Game Developer (Crunch Resistant)',
     '{"reason": "Was not crunch resistant enough"}'::jsonb),

    -- Pending (6)
    ('a2000001-0012-0000-0000-000000000001', '113198465471291118912', 'd2000001-0000-0000-0000-000000000002',
     DATE '2025-03-20', 'pending', DATE '2025-04-01', 'Systems Architect', '{}'::jsonb),
    ('a2000001-0013-0000-0000-000000000001', '113198465471291118912', 'd3000001-0000-0000-0000-000000000001',
     DATE '2025-03-21', 'pending', DATE '2025-04-02', 'Principal Engineer', '{}'::jsonb),
    ('a2000001-0014-0000-0000-000000000001', '113198465471291118912', 'd3000004-0000-0000-0000-000000000001',
     DATE '2025-03-22', 'pending', DATE '2025-04-03', 'Research Engineer', '{}'::jsonb),
    ('a2000001-0015-0000-0000-000000000001', '113198465471291118912', 'd1000005-0000-0000-0000-000000000001',
     DATE '2025-03-23', 'pending', DATE '2025-04-04', 'DevOps Engineer', '{}'::jsonb),
    ('a2000001-0016-0000-0000-000000000001', '113198465471291118912', 'd1000006-0000-0000-0000-000000000001',
     DATE '2025-03-24', 'pending', DATE '2025-04-05', 'Nocturnal Software Consultant', '{}'::jsonb),
    ('a2000001-0017-0000-0000-000000000001', '113198465471291118912', 'd3000005-0000-0000-0000-000000000001',
     DATE '2025-03-25', 'pending', DATE '2025-04-06', 'Senior Developer', '{}'::jsonb),

    -- Withdrawn (3)
    ('a2000001-0018-0000-0000-000000000001', '113198465471291118912', 'd3000007-0000-0000-0000-000000000001',
     DATE '2025-03-16', 'withdrawn', DATE '2025-03-22', 'Chaos Engineer',
     '{"reason": "Too much on-call"}'::jsonb),
    ('a2000001-0019-0000-0000-000000000001', '113198465471291118912', 'd1000007-0000-0000-0000-000000000001',
     DATE '2025-03-17', 'withdrawn', DATE '2025-03-23', 'Mysterious Backend Developer',
     '{"reason": "NDA was too mysterious"}'::jsonb),
    ('a2000001-0020-0000-0000-000000000001', '113198465471291118912', 'd3000009-0000-0000-0000-000000000001',
     DATE '2025-03-18', 'withdrawn', DATE '2025-03-24', 'Fully Remote Developer',
     '{"reason": "Actually wanted to see sunlight occasionally"}'::jsonb)
ON CONFLICT (user_id, job_id) DO UPDATE SET final_outcome = EXCLUDED.final_outcome, metadata = EXCLUDED.metadata;


-- =========================
-- APPLICATION STAGES
-- The 'Applied' stage is auto-created by trigger
-- We add subsequent stages for completed applications
-- =========================

-- =========================
-- ROSALIA'S STAGES
-- =========================

-- App 1: Senior Software Engineer @ Starlit (REJECTED after OA)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-01-16 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000001-0001-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0010001-0001-0000-0000-000000000002', 'a0000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-01-20 14:00:00+00', TIMESTAMPTZ '2025-01-20 16:00:00+00', 'rejected',
     'Did not pass the technical assessment')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App 4: Systems Architect @ Obsidian (REJECTED at phone screen)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-01-13 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000001-0004-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0010004-0004-0000-0000-000000000002', 'a0000001-0004-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-01-16 18:00:00+00', TIMESTAMPTZ '2025-01-16 20:00:00+00', 'successful',
     'Passed the assessment'),
    ('e0010004-0004-0000-0000-000000000003', 'a0000001-0004-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-01-22 15:00:00+00', TIMESTAMPTZ '2025-01-22 16:00:00+00', 'rejected',
     'Looking for more experience with distributed systems')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App 5: ML Engineer @ Prismatic (REJECTED after onsite)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-01-26 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000001-0005-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0010005-0005-0000-0000-000000000002', 'a0000001-0005-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-01-30 14:00:00+00', TIMESTAMPTZ '2025-01-30 16:00:00+00', 'successful',
     'ML assessment completed'),
    ('e0010005-0005-0000-0000-000000000003', 'a0000001-0005-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-02-03 15:00:00+00', TIMESTAMPTZ '2025-02-03 16:00:00+00', 'successful',
     'Good conversation about ML systems'),
    ('e0010005-0005-0000-0000-000000000004', 'a0000001-0005-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-02-10 09:00:00+00', TIMESTAMPTZ '2025-02-10 17:00:00+00', 'rejected',
     'Close but went with another candidate')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App 13: Starbucks Barista (THE SUCCESS!)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-02-26 10:00:00+00', notes = 'Application submitted online'
WHERE application_id = 'a0000001-0013-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0010013-0013-0000-0000-000000000002', 'a0000001-0013-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-01 14:00:00+00', TIMESTAMPTZ '2025-03-01 14:30:00+00', 'successful',
     'Brief phone call about availability and coffee enthusiasm'),
    ('e0010013-0013-0000-0000-000000000003', 'a0000001-0013-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-05 10:00:00+00', TIMESTAMPTZ '2025-03-05 11:00:00+00', 'successful',
     'In-person interview at the store. Demonstrated latte art potential.'),
    ('e0010013-0013-0000-0000-000000000004', 'a0000001-0013-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-03-08 16:00:00+00', TIMESTAMPTZ '2025-03-10 12:00:00+00', 'successful',
     'Offer accepted. Starting next week. Finally, a yes.')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;


-- =========================
-- KHANH'S STAGES (more successful journey)
-- =========================

-- App 1: Senior SWE @ Starlit (OFFER - full journey)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-01-19 10:00:00+00', notes = 'Application submitted with strong portfolio'
WHERE application_id = 'a0000003-0001-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0030001-0001-0000-0000-000000000002', 'a0000003-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-01-22 14:00:00+00', TIMESTAMPTZ '2025-01-22 16:00:00+00', 'successful',
     'Strong performance on technical assessment'),
    ('e0030001-0001-0000-0000-000000000003', 'a0000003-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-01-28 15:00:00+00', TIMESTAMPTZ '2025-01-28 16:00:00+00', 'successful',
     'Great technical discussion'),
    ('e0030001-0001-0000-0000-000000000004', 'a0000003-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-02-03 09:00:00+00', TIMESTAMPTZ '2025-02-03 17:00:00+00', 'successful',
     'Impressed all interviewers'),
    ('e0030001-0001-0000-0000-000000000005', 'a0000003-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-02-07 14:00:00+00', TIMESTAMPTZ '2025-02-10 12:00:00+00', 'successful',
     'Offer accepted')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App 2: Platform Engineer @ Moonveil (OFFER)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-01-26 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000003-0002-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0030002-0002-0000-0000-000000000002', 'a0000003-0002-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-01-30 18:00:00+00', TIMESTAMPTZ '2025-01-30 20:00:00+00', 'successful',
     'Completed platform design assessment'),
    ('e0030002-0002-0000-0000-000000000003', 'a0000003-0002-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-02-05 15:00:00+00', TIMESTAMPTZ '2025-02-05 16:00:00+00', 'successful',
     'Technical deep dive went well'),
    ('e0030002-0002-0000-0000-000000000004', 'a0000003-0002-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-02-12 09:00:00+00', TIMESTAMPTZ '2025-02-12 16:00:00+00', 'successful',
     'System design round was strong'),
    ('e0030002-0002-0000-0000-000000000005', 'a0000003-0002-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-02-15 10:00:00+00', TIMESTAMPTZ '2025-02-18 14:00:00+00', 'successful',
     'Competitive offer received and accepted')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App 3: SRE @ Aethon Cloud (OFFER)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-02-11 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000003-0003-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0030003-0003-0000-0000-000000000002', 'a0000003-0003-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-02-18 15:00:00+00', TIMESTAMPTZ '2025-02-18 16:00:00+00', 'successful',
     'Good discussion about incident response'),
    ('e0030003-0003-0000-0000-000000000003', 'a0000003-0003-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-02-25 09:00:00+00', TIMESTAMPTZ '2025-02-25 15:00:00+00', 'successful',
     'Strong performance in on-call simulation'),
    ('e0030003-0003-0000-0000-000000000004', 'a0000003-0003-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-03-01 14:00:00+00', TIMESTAMPTZ '2025-03-05 10:00:00+00', 'successful',
     'Offer extended and accepted')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;


-- =========================
-- BARON'S STAGES (mixed results)
-- =========================

-- App 1: Frontend Dev @ Starlit (OFFER)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-01-21 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000002-0001-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0020001-0001-0000-0000-000000000002', 'a0000002-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-01-25 14:00:00+00', TIMESTAMPTZ '2025-01-25 16:00:00+00', 'successful',
     'React assessment completed well'),
    ('e0020001-0001-0000-0000-000000000003', 'a0000002-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-02-01 15:00:00+00', TIMESTAMPTZ '2025-02-01 16:00:00+00', 'successful',
     'Good technical conversation'),
    ('e0020001-0001-0000-0000-000000000004', 'a0000002-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-02-08 09:00:00+00', TIMESTAMPTZ '2025-02-08 15:00:00+00', 'successful',
     'Strong frontend system design'),
    ('e0020001-0001-0000-0000-000000000005', 'a0000002-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-02-12 14:00:00+00', TIMESTAMPTZ '2025-02-15 10:00:00+00', 'successful',
     'Offer accepted')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App 3: SWE II @ Obsidian (REJECTED after phone)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-02-06 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000002-0003-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0020003-0003-0000-0000-000000000002', 'a0000002-0003-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-02-12 15:00:00+00', TIMESTAMPTZ '2025-02-12 16:00:00+00', 'rejected',
     'Looking for different experience')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App 6: Remote Backend @ Wanderlust (WITHDRAWN)
UPDATE application_stages
SET status = 'successful', ended_at = TIMESTAMPTZ '2025-02-13 10:00:00+00', notes = 'Application submitted'
WHERE application_id = 'a0000002-0006-0000-0000-000000000001'
  AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('e0020006-0006-0000-0000-000000000002', 'a0000002-0006-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-02-18 18:00:00+00', TIMESTAMPTZ '2025-02-18 20:00:00+00', 'successful',
     'Assessment completed'),
    ('e0020006-0006-0000-0000-000000000003', 'a0000002-0006-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Withdrawn'),
     TIMESTAMPTZ '2025-02-25 10:00:00+00', TIMESTAMPTZ '2025-02-25 10:00:00+00', 'successful',
     'Withdrew after accepting other offer')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;


-- =========================
-- ROSALIA'S NEW STAGES (Moon-themed apps)
-- =========================

-- App: Lunaria Labs Senior SWE (OFFER - full journey)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-06 10:00:00+00'
WHERE application_id = 'a1000001-0001-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f1000001-0001-0000-0000-000000000002', 'a1000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-03-10 14:00:00+00', TIMESTAMPTZ '2025-03-10 16:00:00+00', 'successful', 'Aced the lunar algorithms'),
    ('f1000001-0001-0000-0000-000000000003', 'a1000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-15 15:00:00+00', TIMESTAMPTZ '2025-03-15 16:00:00+00', 'successful', 'Great conversation about distributed systems'),
    ('f1000001-0001-0000-0000-000000000004', 'a1000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-22 09:00:00+00', TIMESTAMPTZ '2025-03-22 17:00:00+00', 'successful', 'Crushed the system design'),
    ('f1000001-0001-0000-0000-000000000005', 'a1000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-03-28 14:00:00+00', TIMESTAMPTZ '2025-04-01 12:00:00+00', 'successful', 'Accepted! Finally a real tech offer!')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App: Werewolf Consultancy (OFFER - fun journey)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-11 22:00:00+00', notes = 'Applied at midnight for authenticity'
WHERE application_id = 'a1000001-0003-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f1000001-0003-0000-0000-000000000002', 'a1000001-0003-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-18 23:00:00+00', TIMESTAMPTZ '2025-03-19 00:00:00+00', 'successful', 'Call was at 11 PM. Very on brand.'),
    ('f1000001-0003-0000-0000-000000000003', 'a1000001-0003-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-25 21:00:00+00', TIMESTAMPTZ '2025-03-26 02:00:00+00', 'successful', 'Full moon interview. Howling was optional.'),
    ('f1000001-0003-0000-0000-000000000004', 'a1000001-0003-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-04-01 20:00:00+00', TIMESTAMPTZ '2025-04-08 23:59:00+00', 'successful', 'Accepted the nocturnal lifestyle')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App: Cryptid Career Services (REJECTED at onsite)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-13 10:00:00+00'
WHERE application_id = 'a1000001-0008-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f1000001-0008-0000-0000-000000000002', 'a1000001-0008-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-03-16 14:00:00+00', TIMESTAMPTZ '2025-03-16 16:00:00+00', 'successful', 'Passed the Loch Ness algorithm test'),
    ('f1000001-0008-0000-0000-000000000003', 'a1000001-0008-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-20 15:00:00+00', TIMESTAMPTZ '2025-03-20 16:00:00+00', 'successful', 'Discussed Bigfoot-scale systems'),
    ('f1000001-0008-0000-0000-000000000004', 'a1000001-0008-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-26 09:00:00+00', TIMESTAMPTZ '2025-03-26 15:00:00+00', 'rejected', 'Could not verify Sasquatch sighting. Disqualified.')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;


-- =========================
-- KHANH'S NEW STAGES (Star-themed apps)
-- =========================

-- App: Polaris Staff Engineer (OFFER - stellar journey)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-06 10:00:00+00'
WHERE application_id = 'a2000001-0001-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f2000001-0001-0000-0000-000000000002', 'a2000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-03-10 14:00:00+00', TIMESTAMPTZ '2025-03-10 16:00:00+00', 'successful', 'Perfect score. Like a guiding star.'),
    ('f2000001-0001-0000-0000-000000000003', 'a2000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-15 15:00:00+00', TIMESTAMPTZ '2025-03-15 16:00:00+00', 'successful', 'Impressed them with system design vision'),
    ('f2000001-0001-0000-0000-000000000004', 'a2000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-22 09:00:00+00', TIMESTAMPTZ '2025-03-22 17:00:00+00', 'successful', 'Flawless performance across all rounds'),
    ('f2000001-0001-0000-0000-000000000005', 'a2000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-03-28 14:00:00+00', TIMESTAMPTZ '2025-04-01 12:00:00+00', 'successful', 'Accepted. North Star energy.')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App: Astrology.ai (OFFER - cosmic journey)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-10 10:00:00+00'
WHERE application_id = 'a2000001-0005-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f2000001-0005-0000-0000-000000000002', 'a2000001-0005-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-03-14 14:00:00+00', TIMESTAMPTZ '2025-03-14 16:00:00+00', 'successful', 'Aligned algorithms with Venus transit'),
    ('f2000001-0005-0000-0000-000000000003', 'a2000001-0005-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-20 15:00:00+00', TIMESTAMPTZ '2025-03-20 16:00:00+00', 'successful', 'Mercury was direct. Good omens.'),
    ('f2000001-0005-0000-0000-000000000004', 'a2000001-0005-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-28 09:00:00+00', TIMESTAMPTZ '2025-03-28 15:00:00+00', 'successful', 'Birth chart was CEO-compatible'),
    ('f2000001-0005-0000-0000-000000000005', 'a2000001-0005-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-04-02 14:00:00+00', TIMESTAMPTZ '2025-04-05 12:00:00+00', 'successful', 'Stars aligned. Literally.')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App: Shooting Star Startups (REJECTED - they ran out of funding)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-12 10:00:00+00'
WHERE application_id = 'a2000001-0007-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f2000001-0007-0000-0000-000000000002', 'a2000001-0007-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-18 15:00:00+00', TIMESTAMPTZ '2025-03-18 16:00:00+00', 'successful', 'CEO seemed nervous but excited'),
    ('f2000001-0007-0000-0000-000000000003', 'a2000001-0007-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-24 09:00:00+00', TIMESTAMPTZ '2025-03-24 12:00:00+00', 'rejected', 'Mid-interview: "We need to pause. Our Series A fell through."')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;


-- =========================
-- BARON'S NEW STAGES (Sun-themed apps)
-- =========================

-- App: Solaris Principal Engineer (OFFER - radiant journey)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-06 10:00:00+00'
WHERE application_id = 'a3000001-0001-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f3000001-0001-0000-0000-000000000002', 'a3000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-03-10 14:00:00+00', TIMESTAMPTZ '2025-03-10 16:00:00+00', 'successful', 'Bright performance on system design'),
    ('f3000001-0001-0000-0000-000000000003', 'a3000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-15 15:00:00+00', TIMESTAMPTZ '2025-03-15 16:00:00+00', 'successful', 'Radiated confidence'),
    ('f3000001-0001-0000-0000-000000000004', 'a3000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-22 09:00:00+00', TIMESTAMPTZ '2025-03-22 17:00:00+00', 'successful', 'Shone in every interview'),
    ('f3000001-0001-0000-0000-000000000005', 'a3000001-0001-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Offer'),
     TIMESTAMPTZ '2025-03-28 14:00:00+00', TIMESTAMPTZ '2025-04-01 12:00:00+00', 'successful', 'Accepted the sunny offer')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App: Sunburn Studios (REJECTED - work-life balance issue)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-12 10:00:00+00'
WHERE application_id = 'a3000001-0007-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f3000001-0007-0000-0000-000000000002', 'a3000001-0007-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'OA'),
     TIMESTAMPTZ '2025-03-16 14:00:00+00', TIMESTAMPTZ '2025-03-16 16:00:00+00', 'successful', 'Good game dev assessment'),
    ('f3000001-0007-0000-0000-000000000003', 'a3000001-0007-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-20 15:00:00+00', TIMESTAMPTZ '2025-03-20 16:00:00+00', 'successful', 'Asked about crunch. Red flags.'),
    ('f3000001-0007-0000-0000-000000000004', 'a3000001-0007-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Onsite/Virtual'),
     TIMESTAMPTZ '2025-03-24 09:00:00+00', TIMESTAMPTZ '2025-03-24 18:00:00+00', 'rejected', 'Asked about overtime policy. They laughed. I left.')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

-- App: Corona Software (REJECTED at phone screen - unfortunate)
UPDATE application_stages SET status = 'successful', ended_at = TIMESTAMPTZ '2025-03-11 10:00:00+00'
WHERE application_id = 'a3000001-0006-0000-0000-000000000001' AND stage_id = (SELECT stage_id FROM stages WHERE stage_name = 'Applied');

INSERT INTO application_stages (app_stage_id, application_id, stage_id, started_at, ended_at, status, notes) VALUES
    ('f3000001-0006-0000-0000-000000000002', 'a3000001-0006-0000-0000-000000000001',
     (SELECT stage_id FROM stages WHERE stage_name = 'Phone Screen'),
     TIMESTAMPTZ '2025-03-18 15:00:00+00', TIMESTAMPTZ '2025-03-18 16:00:00+00', 'rejected', 'Made a joke about the company name. Did not land.')
ON CONFLICT (application_id, stage_id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;


-- =============================================================================
-- SUMMARY
-- =============================================================================
-- Rosalia (102182222430157775253): 33 applications (13 original + 20 new)
--   - 4 offers 
--   - 18 rejections
--   - 8 pending
--   - 3 withdrawn
--
-- Khanh (113198465471291118912): 29 applications (9 original + 20 new)
--   - 8 offers
--   - 8 rejections
--   - 9 pending
--   - 4 withdrawn
--
-- Baron S (106077827475034522998): 28 applications (8 original + 20 new)
--   - 6 offers
--   - 10 rejections
--   - 8 pending
--   - 4 withdrawn
--
-- Total: ~90 applications across 40 companies
-- =============================================================================
