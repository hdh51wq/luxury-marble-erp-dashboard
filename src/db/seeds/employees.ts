import { db } from '@/db';
import { employees } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sampleEmployees = [
        // Production Department (4 employees)
        {
            name: 'Michael Rodriguez',
            email: 'michael.rodriguez@marblecompany.com',
            password: hashedPassword,
            department: 'Production',
            role: 'Machine Operator',
            workingHours: 185,
            performanceScore: 82,
            avatar: 'https://i.pravatar.cc/150?img=1',
            createdAt: new Date('2024-02-15').toISOString(),
        },
        {
            name: 'Sarah Chen',
            email: 'sarah.chen@marblecompany.com',
            password: hashedPassword,
            department: 'Production',
            role: 'Production Supervisor',
            workingHours: 192,
            performanceScore: 88,
            avatar: 'https://i.pravatar.cc/150?img=2',
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            name: 'David Thompson',
            email: 'david.thompson@marblecompany.com',
            password: hashedPassword,
            department: 'Production',
            role: 'Cutting Specialist',
            workingHours: 178,
            performanceScore: 85,
            avatar: 'https://i.pravatar.cc/150?img=3',
            createdAt: new Date('2024-03-10').toISOString(),
        },
        {
            name: 'Maria Santos',
            email: 'maria.santos@marblecompany.com',
            password: hashedPassword,
            department: 'Production',
            role: 'Polishing Expert',
            workingHours: 188,
            performanceScore: 90,
            avatar: 'https://i.pravatar.cc/150?img=4',
            createdAt: new Date('2024-02-28').toISOString(),
        },
        // Sales Department (3 employees)
        {
            name: 'James Anderson',
            email: 'james.anderson@marblecompany.com',
            password: hashedPassword,
            department: 'Sales',
            role: 'Sales Manager',
            workingHours: 195,
            performanceScore: 92,
            avatar: 'https://i.pravatar.cc/150?img=5',
            createdAt: new Date('2024-01-05').toISOString(),
        },
        {
            name: 'Emily Johnson',
            email: 'emily.johnson@marblecompany.com',
            password: hashedPassword,
            department: 'Sales',
            role: 'Sales Representative',
            workingHours: 182,
            performanceScore: 79,
            avatar: 'https://i.pravatar.cc/150?img=6',
            createdAt: new Date('2024-04-12').toISOString(),
        },
        {
            name: 'Robert Martinez',
            email: 'robert.martinez@marblecompany.com',
            password: hashedPassword,
            department: 'Sales',
            role: 'Account Manager',
            workingHours: 190,
            performanceScore: 86,
            avatar: 'https://i.pravatar.cc/150?img=7',
            createdAt: new Date('2024-03-18').toISOString(),
        },
        // Quality Control Department (3 employees)
        {
            name: 'Linda Williams',
            email: 'linda.williams@marblecompany.com',
            password: hashedPassword,
            department: 'Quality Control',
            role: 'QC Inspector',
            workingHours: 176,
            performanceScore: 84,
            avatar: 'https://i.pravatar.cc/150?img=8',
            createdAt: new Date('2024-02-22').toISOString(),
        },
        {
            name: 'Christopher Lee',
            email: 'christopher.lee@marblecompany.com',
            password: hashedPassword,
            department: 'Quality Control',
            role: 'QC Manager',
            workingHours: 198,
            performanceScore: 91,
            avatar: 'https://i.pravatar.cc/150?img=9',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Patricia Brown',
            email: 'patricia.brown@marblecompany.com',
            password: hashedPassword,
            department: 'Quality Control',
            role: 'Quality Analyst',
            workingHours: 180,
            performanceScore: 87,
            avatar: 'https://i.pravatar.cc/150?img=10',
            createdAt: new Date('2024-03-25').toISOString(),
        },
        // Logistics Department (3 employees)
        {
            name: 'Daniel Kim',
            email: 'daniel.kim@marblecompany.com',
            password: hashedPassword,
            department: 'Logistics',
            role: 'Warehouse Manager',
            workingHours: 194,
            performanceScore: 89,
            avatar: 'https://i.pravatar.cc/150?img=11',
            createdAt: new Date('2024-01-30').toISOString(),
        },
        {
            name: 'Jennifer Garcia',
            email: 'jennifer.garcia@marblecompany.com',
            password: hashedPassword,
            department: 'Logistics',
            role: 'Logistics Coordinator',
            workingHours: 172,
            performanceScore: 81,
            avatar: 'https://i.pravatar.cc/150?img=12',
            createdAt: new Date('2024-04-05').toISOString(),
        },
        {
            name: 'Thomas Wilson',
            email: 'thomas.wilson@marblecompany.com',
            password: hashedPassword,
            department: 'Logistics',
            role: 'Shipping Supervisor',
            workingHours: 186,
            performanceScore: 83,
            avatar: 'https://i.pravatar.cc/150?img=13',
            createdAt: new Date('2024-03-08').toISOString(),
        },
        // Management Department (2 employees)
        {
            name: 'Angela Davis',
            email: 'angela.davis@marblecompany.com',
            password: hashedPassword,
            department: 'Management',
            role: 'Operations Manager',
            workingHours: 200,
            performanceScore: 94,
            avatar: 'https://i.pravatar.cc/150?img=14',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Richard Taylor',
            email: 'richard.taylor@marblecompany.com',
            password: hashedPassword,
            department: 'Management',
            role: 'General Manager',
            workingHours: 198,
            performanceScore: 95,
            avatar: 'https://i.pravatar.cc/150?img=15',
            createdAt: new Date('2024-01-02').toISOString(),
        },
    ];

    await db.insert(employees).values(sampleEmployees);
    
    console.log('✅ Employees seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});