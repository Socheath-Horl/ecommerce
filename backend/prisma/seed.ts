import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const CATEGORIES = [
  { name: 'Outerwear', slug: 'outerwear' },
  { name: 'Travel', slug: 'travel' },
  { name: 'Carry & Desk', slug: 'carry-desk' },
  { name: 'Drinkware', slug: 'drinkware' },
];

type SeedProduct = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  categorySlug: string;
  description: string;
};

const PRODUCTS: SeedProduct[] = [
  {
    slug: 'field-jacket-waxed-cotton',
    name: 'Field Jacket — Waxed Cotton',
    price: 189.0,
    stock: 24,
    categorySlug: 'outerwear',
    description:
      'A field jacket cut from 8.5oz waxed cotton that starts stiff and breaks in to your shoulders inside a season. The collar stand seals wind, two deep chest pockets sit clear of shoulder-strap rub, and every seam is taped where the rain lives.',
  },
  {
    slug: 'merino-crew-heavy',
    name: 'Merino Crew — Heavy',
    price: 88.0,
    stock: 0,
    categorySlug: 'outerwear',
    description:
      'A heavy 215gsm merino crew knit that rides the line between indoor layer and light outerwear. Merino regulates temperature, resists odor and holds its shape through a season of wear.',
  },
  {
    slug: 'weekender-duffel-04',
    name: 'Weekender Duffel №04',
    price: 120.0,
    stock: 6,
    categorySlug: 'travel',
    description:
      'A no-wire duffel stitched from 18oz waxed duck that stands on its own when full. One compartment swallows a three-day kit, the end pocket keeps shoes separate, and the padded base sits flat in the footwell.',
  },
  {
    slug: 'flight-tote-recycled-nylon',
    name: 'Flight Tote — Recycled Nylon',
    price: 78.0,
    stock: 12,
    categorySlug: 'carry-desk',
    description:
      'A carry-all built from recycled ripstop for a laptop, a folder and a spare layer, packed flat. The padded sleeve is suspended off the bottom so drops land on the bag, not your computer.',
  },
  {
    slug: 'canvas-desktop-roll',
    name: 'Desk Roll — Waxed Canvas',
    price: 54.0,
    stock: 9,
    categorySlug: 'carry-desk',
    description:
      'A canvas roll with twelve slots sized for the pens, bits and brushes that live on your desk. The waxed fabric fends off coffee rings, and the ties keep everything from rolling off the edge of the drawer.',
  },
  {
    slug: 'zip-pouch-large',
    name: 'Zip Pouch — Large',
    price: 26.0,
    stock: 30,
    categorySlug: 'carry-desk',
    description:
      'A flat pouch that turns a bag or a drawer from chaos into categories. Recycled ripstop shell, a chunky two-way zip, and a hanging loop so it can live on a hook by the door.',
  },
  {
    slug: 'stainless-flask-24oz',
    name: 'Stainless Flask 24oz',
    price: 42.0,
    stock: 4,
    categorySlug: 'drinkware',
    description:
      'A 24oz stainless flask whose double-wall vacuum holds temperature for hours, with a wide mouth that makes filling, pouring and cleaning simple.',
  },
  {
    slug: 'insulated-tumbler-16oz',
    name: 'Insulated Tumbler — 16oz',
    price: 34.0,
    stock: 18,
    categorySlug: 'drinkware',
    description:
      'A 16oz double-wall tumbler sized for the cupholder and the desk. Vacuum insulation holds cold through a meeting and hot for the drive home, while the magnetic lid swivels open one-handed.',
  },
];

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@horizon.supply' },
    update: {},
    create: {
      email: 'admin@horizon.supply',
      password: await bcrypt.hash('Admin123!', 10),
      name: 'Horizon Admin',
      role: Role.ADMIN,
    },
  });
  console.log(`[seed] admin: ${admin.email} (${admin.role})`);

  const categoryIds: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    categoryIds[c.slug] = category.id;
    console.log(`[seed] category: ${category.slug}`);
  }

  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        stock: p.stock,
        description: p.description,
        isFeatured: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        description: p.description,
        isFeatured: true,
        categoryId: categoryIds[p.categorySlug],
      },
    });
    console.log(`[seed] product: ${product.slug} — $${p.price} (stock ${p.stock}) ${p.stock === 0 ? '[OUT OF STOCK]' : ''}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());