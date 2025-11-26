import { db } from '@/db';
import { clientNotes } from '@/db/schema';

async function main() {
    const sampleClientNotes = [
        {
            clientId: 1,
            content: 'Client requested custom marble patterns for luxury villa project. Prefers Calacatta Gold with matching veining.',
            type: 'note',
            createdAt: new Date('2024-03-15T10:30:00').toISOString(),
        },
        {
            clientId: 3,
            content: 'Follow up on pending payment for Riverside Mall project. Payment due by March 30th.',
            type: 'reminder',
            createdAt: new Date('2024-03-20T14:15:00').toISOString(),
        },
        {
            clientId: 5,
            content: 'Quote: 450 sqm Carrara White marble at $85/sqm = $38,250. Installation included. Valid for 30 days.',
            type: 'quote',
            createdAt: new Date('2024-02-10T09:00:00').toISOString(),
        },
        {
            clientId: 2,
            content: 'Client very satisfied with previous kitchen countertop installation. Expressed interest in bathroom renovation next quarter.',
            type: 'note',
            createdAt: new Date('2024-01-25T16:45:00').toISOString(),
        },
        {
            clientId: 7,
            content: 'Schedule site visit for hotel lobby marble selection. Client available March 28-30.',
            type: 'reminder',
            createdAt: new Date('2024-03-18T11:20:00').toISOString(),
        },
        {
            clientId: 4,
            content: 'Quote: 280 sqm Nero Marquina marble flooring at $95/sqm = $26,600. Premium finish with anti-slip treatment.',
            type: 'quote',
            createdAt: new Date('2024-02-28T13:30:00').toISOString(),
        },
        {
            clientId: 9,
            content: 'Client mentioned budget constraints. Suggested alternative marble options: Emperador Light as cost-effective alternative to Emperador Dark.',
            type: 'note',
            createdAt: new Date('2024-03-05T10:00:00').toISOString(),
        },
        {
            clientId: 6,
            content: 'Send updated project timeline for office building renovation. Client needs completion before June 15th for grand opening.',
            type: 'reminder',
            createdAt: new Date('2024-03-22T15:45:00').toISOString(),
        },
        {
            clientId: 11,
            content: 'Quote: 620 sqm Statuario marble for apartment complex lobby and corridors. Price: $105/sqm = $65,100. Includes edge finishing.',
            type: 'quote',
            createdAt: new Date('2024-03-12T09:30:00').toISOString(),
        },
        {
            clientId: 8,
            content: 'Discussed maintenance requirements for marble surfaces. Recommended sealing every 12 months and provided care instructions.',
            type: 'note',
            createdAt: new Date('2024-02-18T14:00:00').toISOString(),
        },
        {
            clientId: 12,
            content: 'Confirm delivery date for custom marble columns. Client hosting event on April 20th and needs installation complete by April 15th.',
            type: 'reminder',
            createdAt: new Date('2024-03-25T10:15:00').toISOString(),
        },
        {
            clientId: 10,
            content: 'Quote: 180 sqm Travertine marble for outdoor patio and pool area. $75/sqm = $13,500. Weather-resistant finish included.',
            type: 'quote',
            createdAt: new Date('2024-03-08T11:45:00').toISOString(),
        },
        {
            clientId: 14,
            content: 'Client referred new business opportunity - restaurant chain expansion. Scheduled initial consultation for next week.',
            type: 'note',
            createdAt: new Date('2024-03-19T16:30:00').toISOString(),
        },
        {
            clientId: 13,
            content: 'Review marble samples with client for boutique hotel project. Schedule appointment for March 27th at showroom.',
            type: 'reminder',
            createdAt: new Date('2024-03-21T09:45:00').toISOString(),
        },
        {
            clientId: 15,
            content: 'Quote: 340 sqm Crema Marfil marble for residential development entrance halls. $88/sqm = $29,920. Premium polishing service.',
            type: 'quote',
            createdAt: new Date('2024-03-14T13:00:00').toISOString(),
        },
    ];

    await db.insert(clientNotes).values(sampleClientNotes);
    
    console.log('✅ Client notes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});