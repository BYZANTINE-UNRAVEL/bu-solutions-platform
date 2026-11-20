import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { pageSchema, productSchema, settingsSchema } from "../lib/validators";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const products = [
  {
    slug: "hims",
    name: "HIMS",
    code: "HIMS",
    sortOrder: 1,
    summary: "The hospital’s daily record: patients, consultants, departments, and billing, in one web application.",
    audience: "hospitals that need one operational record for the front desk and the wards",
    introduction:
      "HIMS is the hospital information system. Registration, the consultant list, departments, and billing live in the same application, so the front desk and the wards are not keeping separate books.\n\nIt is a web application. Staff open it in a browser. It can be hosted online, or installed on a server inside the hospital.",
    onlineSummary: "Staff open HIMS in a browser. The server is hosted and reached over the internet.",
    onlineDetail:
      "A receptionist on any desk with a browser can register a patient, raise a bill, and see the same record the ward sees. Nothing is installed on the desk itself.",
    offlineSummary: "The same HIMS, installed on a server on the hospital network.",
    offlineDetail:
      "The application does not need the public internet. Desktops and laptops on the hospital LAN open it in a browser. Work continues through an outage outside the building.",
    seoTitle: "HIMS for hospitals",
    seoDescription:
      "Hospital information system for registration, consultants, departments, and billing. Online or on the hospital network.",
    features: [
      ["Registration", "A patient is entered once and stays on the record the rest of the hospital uses."],
      ["Consultants and departments", "The people and the units of the hospital are masters, not free text on each bill."],
      ["Billing and receipts", "Charges and receipts are raised against the same patient record."],
      ["One shared record", "The front desk and the wards look at the same file, not a copy that has to be reconciled."],
    ],
  },
  {
    slug: "lims",
    name: "LIMS",
    code: "LIMS",
    sortOrder: 2,
    summary: "Laboratory information system for registration, collection, billing, approval, and the printed report.",
    audience: "clinical laboratories that report results to patients and referring doctors",
    introduction:
      "LIMS runs a clinical laboratory from the moment a patient is registered to the moment the report is approved and sent.\n\nCollection, billing, result entry, approval, and the PDF are parts of one record. Analyzers can send results in. Prior results can be printed with the current report. Statements and referring-doctor commissions are calculated from the same bills.",
    onlineSummary: "The laboratory works in a browser against a hosted server.",
    onlineDetail:
      "Technicians, the billing desk, and the doctor who approves reports can be in different rooms, or different buildings, and still share one record. Reports go out by PDF, email, WhatsApp, or SMS.",
    offlineSummary: "The same LIMS, on a server inside the laboratory.",
    offlineDetail:
      "The database and the application stay on the laboratory’s own machine. Analyzers on the local network deliver results without a trip across the public internet. Backup and restore are part of the application.",
    seoTitle: "LIMS for clinical laboratories",
    seoDescription:
      "Laboratory information system for collection, billing, report approval, analyzer results, and PDF reports. Online or on-premises.",
    features: [
      ["Patients and consultants", "Registration keeps the patient and the referring doctor on every bill and report."],
      ["Collection", "Samples are collected against the tests that were billed."],
      ["Billing and receipts", "Bills, receipts, and the tests on them stay tied to the report."],
      ["Approval", "A result can be entered, approved, rejected, or sent back for recheck."],
      ["History on the report", "Earlier results for the same test can be printed with the current report, under the laboratory’s own control."],
      ["Pathology descriptions", "Narrative reports sit beside numeric results."],
      ["Statements and commissions", "Referring-doctor statements and commissions are calculated from the bills."],
      ["Reagents and purchases", "Batches, brands, and purchase lines are kept with the bench, not in a side spreadsheet."],
      ["Analyzers", "Instruments can deliver results into the order they belong to."],
      ["PDF, email, WhatsApp, SMS", "The approved report leaves as a PDF and can be sent by the channels the laboratory already uses."],
    ],
  },
  {
    slug: "equipment-integrator",
    name: "Equipment Integrator",
    code: "INT",
    sortOrder: 3,
    summary: "Connects laboratory instruments to a hospital system the hospital already runs, including one from another vendor.",
    audience: "hospitals whose information system and laboratory instruments were not built to talk to each other",
    introduction:
      "Equipment Integrator sits between the analyzers and the hospital information system. The hospital may already have a HIMS from another vendor. The integrator receives what the instrument sends and places it in that system, mapped to the hospital’s own test codes.\n\nIt does not replace the hospital system. It is the bridge.",
    onlineSummary: "The integrator runs as a hosted service and talks to the hospital system over the network.",
    onlineDetail:
      "Useful when the hospital system is itself online and the instruments can reach the integrator. Orders and results move without a second copy being typed.",
    offlineSummary: "The integrator runs on the hospital network, next to the instruments and the HIMS.",
    offlineDetail:
      "The usual installation. The analyzer, the integrator, and the hospital system share a LAN. A dropped internet connection does not stop results from landing in the record.",
    seoTitle: "Equipment integrator for HIMS vendors",
    seoDescription:
      "Connect laboratory analyzers to an existing hospital information system, including systems from other vendors. Online or on the hospital network.",
    features: [
      ["For an existing HIMS", "Built for the system the hospital already has, including one supplied by another vendor."],
      ["Instrument results", "The integrator receives what the analyzer sends, instead of asking someone to retype it."],
      ["Code mapping", "Analyzer codes are mapped to the test codes the hospital system already uses."],
      ["Beside the equipment", "It is installed where the instruments are, not as a separate reporting product."],
    ],
  },
  {
    slug: "equipment-reporting",
    name: "Equipment Reporting",
    code: "RPT",
    sortOrder: 4,
    summary: "A reporting application for an analyzer, for a laboratory that does not want a full LIMS.",
    audience: "laboratories that need a report from one instrument, not a whole laboratory system",
    introduction:
      "Equipment Reporting is a standalone web application for a laboratory instrument. It receives results, applies the laboratory’s reference intervals and units, and prints a PDF.\n\nIt is the right size when the laboratory has an analyzer and needs a report, and does not need patient billing, commissions, or the rest of a LIMS. Each instrument family can have its own reporting app. Hematology analyzers are the pattern: live results, flags, and a report the laboratory can stand behind.",
    onlineSummary: "The reporting app is hosted, and the analyzer sends results to it.",
    onlineDetail:
      "A small laboratory can run the report desk in a browser without keeping a server in a back room. The reference intervals still belong to that laboratory, not to a shared default.",
    offlineSummary: "The reporting app runs on a computer beside the analyzer.",
    offlineDetail:
      "The listener and the database stay on the local machine. Results arrive over the instrument connection. The original analyzer value is kept, so a later change to age, sex, or the reference interval does not stack transformations on top of each other.",
    seoTitle: "Standalone equipment reporting",
    seoDescription:
      "Reporting applications for laboratory analyzers: live results, reference intervals, flags, and PDF reports, without a full LIMS.",
    features: [
      ["Live results", "Results appear as the analyzer sends them."],
      ["Reference intervals", "The laboratory sets intervals by age and sex, or uses the values the analyzer sent."],
      ["Units and flags", "Units, decimal places, and flags are configured once and applied to the result and the reference limits."],
      ["The original value is kept", "Editing a patient and reprocessing does not compound a previous conversion."],
      ["PDF report", "The report is a PDF from the configured groups and the order the laboratory wants."],
    ],
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    code: "PHM",
    sortOrder: 5,
    summary: "Pharmacy management for stock, purchase, batch, expiry, dispensing, and billing.",
    audience: "hospital pharmacies and retail pharmacies that need stock and the bill in one application",
    introduction:
      "Pharmacy is the counter and the store. Items, brands, purchases, batches, expiry, dispensing, and the bill are one application, so a strip that was sold can be traced to the batch it came from.\n\nIt stands separate from HIMS. A hospital can run both. A retail pharmacy can run this one alone.",
    onlineSummary: "The pharmacy works in a browser against a hosted server.",
    onlineDetail:
      "More than one counter can dispense against the same stock. Purchase and the bill are visible to whoever is allowed to see them, without a copy of the software on each till.",
    offlineSummary: "The same pharmacy application, on a server in the shop or the hospital.",
    offlineDetail:
      "Dispensing does not wait on the public internet. The stock file stays on the premises. Counters on the local network open it in a browser.",
    seoTitle: "Pharmacy management",
    seoDescription:
      "Pharmacy software for stock, purchase, batches, expiry, dispensing, and billing. A web app, online or on the premises.",
    features: [
      ["Items, brands, and units", "The catalogue of what the pharmacy stocks, in the units it buys and sells."],
      ["Purchase", "Stock comes in against a purchase, not as a number typed over yesterday’s balance."],
      ["Batch and expiry", "Each batch keeps its expiry. Dispensing can follow the batch."],
      ["Dispensing", "What left the counter is recorded against the batch it left from."],
      ["Billing", "The bill is raised from the same items that left the stock."],
    ],
  },
];

function assertCopy() {
  const settings = settingsSchema.safeParse({
    companyName: "Byzantine Unravel",
    shortName: "Byzantine Unravel",
    caption: "Complex solutions for complex IT problems.",
    introduction:
      "Byzantine Unravel builds the software that hospitals, laboratories, and pharmacies run every day. Registration, billing, results, stock, and the instruments that produce those results are one operation.",
    contactEmail: "",
    contactPhone: "",
    address: "",
    enquiryRetentionMonths: 24,
  });
  if (!settings.success) {
    throw new Error(`Site copy failed validation: ${settings.error.issues.map((issue) => issue.message).join("; ")}`);
  }
}

async function main() {
  assertCopy();
  const existing = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!existing) {
    const pages = [
      {
        key: "home",
        title: "Byzantine Unravel — hospital, laboratory, and pharmacy software",
        description:
          "Byzantine Unravel builds HIMS, LIMS, equipment integration, analyzer reporting, and pharmacy software. Each one runs online or on the premises.",
        canonicalPath: "/",
        heading: "Byzantine Unravel",
        body: "Every product here is a web application, and every product can be installed in two ways. Online means a hosted server and a browser. On the premises means the same application on a server inside the hospital, laboratory, or pharmacy, with no need for the public internet.\n\nThe catalogue is five products. HIMS for the hospital. LIMS for the laboratory. An integrator for instruments that must feed a hospital system the hospital already has. Standalone reporting for an analyzer when a full LIMS is more than the laboratory wants. Pharmacy for stock, batch, and the bill.",
      },
      {
        key: "products",
        title: "Products — Byzantine Unravel",
        description:
          "HIMS, LIMS, equipment integration, standalone analyzer reporting, and pharmacy management. Web applications, online or on the premises.",
        canonicalPath: "/products",
        heading: "Products",
        body: "Five web applications. Each one is available online and on the premises. Open a product for what it covers and how it is installed.",
      },
      {
        key: "contact",
        title: "Contact Byzantine Unravel",
        description:
          "Write to Byzantine Unravel about HIMS, LIMS, equipment integration, analyzer reporting, or pharmacy software.",
        canonicalPath: "/contact",
        heading: "Contact",
        body: "Tell us the hospital, laboratory, or pharmacy, and which product you are asking about. A person reads the enquiry and replies.",
      },
    ];
    for (const page of pages) {
      const parsed = pageSchema.safeParse({
        title: page.title,
        description: page.description,
        canonicalPath: page.canonicalPath,
        heading: page.heading,
        body: page.body,
      });
      if (!parsed.success) {
        throw new Error(
          `${page.key} copy failed validation: ${parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`,
        );
      }
    }
    for (const product of products) {
      const parsed = productSchema.safeParse({
        ...product,
        imageUrl: "",
        published: true,
        onlineEnabled: true,
        offlineEnabled: true,
        features: product.features.map(([title, body]) => ({ title, body })),
      });
      if (!parsed.success) {
        throw new Error(
          `${product.slug} copy failed validation: ${parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`,
        );
      }
    }

    await prisma.siteSetting.create({
      data: {
        id: 1,
        companyName: "Byzantine Unravel",
        shortName: "Byzantine Unravel",
        caption: "Complex solutions for complex IT problems.",
        introduction:
          "Byzantine Unravel builds the software that hospitals, laboratories, and pharmacies run every day. Registration, billing, results, stock, and the instruments that produce those results are one operation.",
        enquiryRetentionMonths: 24,
      },
    });

    await prisma.page.createMany({ data: pages });

    for (const product of products) {
      const { features, ...data } = product;
      await prisma.product.create({
        data: {
          ...data,
          published: true,
          onlineEnabled: true,
          offlineEnabled: true,
          features: {
            create: features.map(([title, body], index) => ({ title, body, sortOrder: index })),
          },
        },
      });
    }
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password && password.length >= 8) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await prisma.user.create({
        data: {
          email,
          name: "Administrator",
          passwordHash: await hash(password, 12),
        },
      });
      console.log(`Created admin ${email}`);
    }
  } else {
    console.log("ADMIN_EMAIL and ADMIN_PASSWORD were not both set, so no admin user was created.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
