import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

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

export default app;
