// seed.js => Popula o banco com um administrador e dados de exemplo.
// Uso: npm run seed   (pode ser executado mais de uma vez sem duplicar)

const bcrypt = require('bcrypt');
const prisma = require('../src/config/prisma');

async function main() {
    const adminEmail = 'admin@cyberlearn.com';
    const studentEmail = 'aluno@cyberlearn.com';

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            name: 'Administrador',
            email: adminEmail,
            passwordHash: await bcrypt.hash('Admin@123456', 12),
            role: 'ADMIN'
        }
    });

    const student = await prisma.user.upsert({
        where: { email: studentEmail },
        update: {},
        create: {
            name: 'Aluno Exemplo',
            email: studentEmail,
            passwordHash: await bcrypt.hash('Aluno@123456', 12),
            role: 'STUDENT'
        }
    });

    // Só cria o conteúdo de exemplo se ainda não houver módulos
    if ((await prisma.module.count()) === 0) {
        const modulos = [
            {
                title: 'Fundamentos de Cibersegurança',
                description: 'Conceitos de segurança da informação, ameaças digitais e proteção de sistemas.',
                materials: [
                    { title: 'Guia de Fundamentos de Cibersegurança', url: 'https://example.com/guia-fundamentos.pdf', type: 'DOCUMENT' },
                    { title: 'Introdução à Segurança da Informação', url: 'https://example.com/intro-seguranca', type: 'VIDEO' }
                ]
            },
            {
                title: 'Segurança de Redes',
                description: 'Protocolos, conceitos de redes e mecanismos para proteger conexões.',
                materials: [
                    { title: 'Introdução à Segurança de Redes', url: 'https://example.com/redes.pdf', type: 'DOCUMENT' }
                ]
            },
            {
                title: 'Desenvolvimento Web Seguro',
                description: 'Vulnerabilidades comuns em aplicações web e boas práticas de desenvolvimento.',
                materials: [
                    { title: 'Checklist de Desenvolvimento Seguro', url: 'https://example.com/checklist-dev-seguro', type: 'SLIDE' }
                ]
            }
        ];

        for (const { materials, ...modulo } of modulos) {
            await prisma.module.create({
                data: {
                    ...modulo,
                    userId: admin.id,
                    materials: { create: materials }
                }
            });
        }
    }

    if ((await prisma.discussionTopic.count()) === 0) {
        await prisma.discussionTopic.createMany({
            data: [
                {
                    title: 'Como começar a estudar cibersegurança?',
                    description: 'Quais conceitos e ferramentas vocês recomendam para quem está começando?',
                    userId: student.id
                },
                {
                    title: 'Diferenças entre hashing e criptografia',
                    description: 'Gostaria de entender quando utilizar hashing e quando utilizar criptografia.',
                    userId: student.id
                }
            ]
        });
    }

    console.log('Seed concluído.');
    console.log(`  Admin : ${adminEmail} / Admin@123456`);
    console.log(`  Aluno : ${studentEmail} / Aluno@123456`);
}

main()
    .catch((error) => {
        console.error('Erro ao executar o seed:', error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
