import { db } from '@/db';
import { sales, clients } from '@/db/schema';

async function main() {
    // First, get all existing client IDs
    const existingClients = await db.select().from(clients);
    
    if (existingClients.length === 0) {
        console.error('❌ No clients found in database. Please seed clients table first.');
        return;
    }
    
    const clientIds = existingClients.map(client => client.id);
    
    // Helper function to get random client ID
    const getRandomClientId = () => {
        return clientIds[Math.floor(Math.random() * clientIds.length)];
    };
    
    const sampleSales = [
        {
            clientId: getRandomClientId(),
            projectName: 'Luxury Hotel Lobby Renovation',
            amount: 285000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Residential Villa Flooring',
            amount: 45000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-01-22').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Office Building Reception Area',
            amount: 175000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-02-05').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Shopping Mall Entrance',
            amount: 320000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-02-18').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Penthouse Bathroom Remodel',
            amount: 68000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-03-02').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Restaurant Interior Upgrade',
            amount: 92000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-03-15').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Corporate Headquarters Flooring',
            amount: 340000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-03-28').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Boutique Hotel Suite Bathrooms',
            amount: 125000,
            status: 'In Progress',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-04-10').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Medical Center Main Entrance',
            amount: 210000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-04-22').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Private Residence Kitchen',
            amount: 38000,
            status: 'Pending',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-05-05').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Airport Terminal Expansion',
            amount: 450000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-05-18').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Luxury Condominium Lobby',
            amount: 195000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-01-08').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Bank Branch Interior',
            amount: 155000,
            status: 'Completed',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-01-30').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Spa and Wellness Center',
            amount: 88000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-02-12').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Art Gallery Flooring',
            amount: 72000,
            status: 'Cancelled',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-02-25').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Executive Office Suite',
            amount: 58000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-03-08').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'High-Rise Apartment Bathrooms',
            amount: 142000,
            status: 'In Progress',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-03-21').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Retail Store Renovation',
            amount: 65000,
            status: 'Pending',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-04-03').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Country Club Facility',
            amount: 280000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-04-16').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Historic Building Restoration',
            amount: 225000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-04-29').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'University Library Entrance',
            amount: 118000,
            status: 'Cancelled',
            paymentStatus: 'Overdue',
            createdAt: new Date('2024-05-12').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Luxury Yacht Interior',
            amount: 95000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-05-25').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Convention Center Main Hall',
            amount: 380000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-01-18').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Residential Master Bathroom',
            amount: 32000,
            status: 'Pending',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-02-01').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Corporate Training Center',
            amount: 165000,
            status: 'In Progress',
            paymentStatus: 'Overdue',
            createdAt: new Date('2024-02-14').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Fitness Center Expansion',
            amount: 78000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-02-27').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Private Cinema Room',
            amount: 52000,
            status: 'Cancelled',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-03-11').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Hotel Restaurant Floor',
            amount: 135000,
            status: 'Pending',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-03-24').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Commercial Plaza Walkway',
            amount: 245000,
            status: 'In Progress',
            paymentStatus: 'Partially Paid',
            createdAt: new Date('2024-04-06').toISOString(),
        },
        {
            clientId: getRandomClientId(),
            projectName: 'Penthouse Living Room',
            amount: 85000,
            status: 'Completed',
            paymentStatus: 'Paid',
            createdAt: new Date('2024-04-19').toISOString(),
        },
    ];

    await db.insert(sales).values(sampleSales);
    
    console.log('✅ Sales seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});