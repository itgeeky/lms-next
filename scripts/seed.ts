const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {name: 'Commputer Science'},
        {name: 'Mathematics'},
        {name: 'Music'},
        {name: 'Art'},
        {name: 'History'},
        {name: 'Science'},
        {name: 'Business'},
        {name: 'Economics'},
        {name: 'Biology'},
        {name: 'Chemistry'},
        {name: 'Physics'},
        {name: 'Engineering'},
        {name: 'English'},
        {name: 'Spanish'},
        {name: 'Photography'},
        {name: 'Filming'},
        {name: 'Psychology'},
        {name: 'Fitness'},
        {name: 'Health'},
        {name: 'Cooking'}
      ]
    })

    console.log('Seeding finished.')

    
  } catch (error) {
    console.log(`Error seeding database: ${error}`)
  } finally {
    await database.$disconnect()
  }
}

main();