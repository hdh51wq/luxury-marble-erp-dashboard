import { db } from '@/db';
import { clients } from '@/db/schema';

async function main() {
    const sampleClients = [
        {
            name: 'Michael Chen',
            company: 'Skyline Construction Ltd',
            email: 'm.chen@skylineconstruction.com',
            phone: '+1-555-234-5678',
            totalProjects: 18,
            totalRevenue: 425000,
            createdAt: new Date('2023-12-15').toISOString(),
        },
        {
            name: 'Sarah Martinez',
            company: 'Elite Interiors',
            email: 'sarah@eliteinteriors.com',
            phone: '+1-555-876-5432',
            totalProjects: 12,
            totalRevenue: 285000,
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            name: 'David Thompson',
            company: 'Heritage Architects',
            email: 'd.thompson@heritagearch.com',
            phone: '+44-20-7946-0958',
            totalProjects: 22,
            totalRevenue: 480000,
            createdAt: new Date('2023-11-10').toISOString(),
        },
        {
            name: 'Jennifer Williams',
            company: 'Prestige Real Estate Development',
            email: 'j.williams@prestigerealestate.com',
            phone: '+1-555-123-9876',
            totalProjects: 8,
            totalRevenue: 195000,
            createdAt: new Date('2024-02-05').toISOString(),
        },
        {
            name: 'Robert Anderson',
            company: 'Grand Luxury Hotels Group',
            email: 'r.anderson@grandluxuryhotels.com',
            phone: '+1-555-345-6789',
            totalProjects: 25,
            totalRevenue: 500000,
            createdAt: new Date('2023-10-28').toISOString(),
        },
        {
            name: 'Emily Parker',
            company: 'Modern Design Studio',
            email: 'emily.parker@moderndesignstudio.com',
            phone: '+1-555-567-8901',
            totalProjects: 15,
            totalRevenue: 340000,
            createdAt: new Date('2024-03-12').toISOString(),
        },
        {
            name: 'James Rodriguez',
            company: 'Apex Construction & Engineering',
            email: 'j.rodriguez@apexconstruction.com',
            phone: '+1-555-789-0123',
            totalProjects: 19,
            totalRevenue: 445000,
            createdAt: new Date('2023-12-01').toISOString(),
        },
        {
            name: 'Lisa Wong',
            company: 'Urban Development Corporation',
            email: 'lisa.wong@urbandevelopment.com',
            phone: '+1-555-901-2345',
            totalProjects: 14,
            totalRevenue: 310000,
            createdAt: new Date('2024-01-08').toISOString(),
        },
        {
            name: 'Thomas Mitchell',
            company: 'Classic Architecture Firm',
            email: 't.mitchell@classicarchitecture.com',
            phone: '+1-555-432-1098',
            totalProjects: 10,
            totalRevenue: 225000,
            createdAt: new Date('2024-02-18').toISOString(),
        },
        {
            name: 'Amanda Foster',
            company: 'Luxury Living Interiors',
            email: 'amanda@luxurylivinginteriors.com',
            phone: '+1-555-654-3210',
            totalProjects: 7,
            totalRevenue: 165000,
            createdAt: new Date('2024-03-25').toISOString(),
        },
        {
            name: 'Christopher Lee',
            company: 'Metropolitan Builders Inc',
            email: 'c.lee@metropolitanbuilders.com',
            phone: '+1-555-246-8013',
            totalProjects: 21,
            totalRevenue: 475000,
            createdAt: new Date('2023-11-22').toISOString(),
        },
        {
            name: 'Patricia Hughes',
            company: 'Boutique Hotel Solutions',
            email: 'p.hughes@boutiquehotelsolutions.com',
            phone: '+1-555-369-1470',
            totalProjects: 5,
            totalRevenue: 120000,
            createdAt: new Date('2024-04-02').toISOString(),
        },
        {
            name: 'Daniel Cooper',
            company: 'Residential Property Holdings',
            email: 'd.cooper@residentialproperty.com',
            phone: '+1-555-147-2580',
            totalProjects: 3,
            totalRevenue: 75000,
            createdAt: new Date('2024-04-15').toISOString(),
        },
        {
            name: 'Victoria Barnes',
            company: 'Innovative Design Associates',
            email: 'victoria.barnes@innovativedesign.com',
            phone: '+1-555-258-3691',
            totalProjects: 16,
            totalRevenue: 365000,
            createdAt: new Date('2024-01-30').toISOString(),
        },
        {
            name: 'Kevin Murphy',
            company: 'Premier Construction Solutions',
            email: 'k.murphy@premierconstructionsolutions.com',
            phone: '+1-555-753-9514',
            totalProjects: 11,
            totalRevenue: 255000,
            createdAt: new Date('2024-02-28').toISOString(),
        },
    ];

    await db.insert(clients).values(sampleClients);
    
    console.log('✅ Clients seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});