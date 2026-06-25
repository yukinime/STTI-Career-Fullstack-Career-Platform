"use client";

import React, { useState, useEffect } from "react";

// Translation interface
interface TranslationSet {
  [key: string]: {
    [lang: string]: string;
  };
}

// Complete translations for all languages
const translations: TranslationSet = {
  // Page titles
  'TENTANG KAMI': {
    'id': 'TENTANG KAMI',
    'en': 'ABOUT US',
    'ja': '私たちについて'
  },
  'Pertanyaan yang Sering Diajukan': {
    'id': 'Pertanyaan yang Sering Diajukan',
    'en': 'Frequently Asked Questions',
    'ja': 'よくあるご質問'
  },
  'Hubungi Kami': {
    'id': 'Hubungi Kami',
    'en': 'Contact Us',
    'ja': 'お問い合わせ'
  },
  
  // About content - paragraph 1
  'about_paragraph_1': {
    'id': 'Sekolah Tinggi Teknologi Informatika Sony Sugema Career Center yang berada di bawah Bidang Kemahasiswaan Sekolah Tinggi Teknologi Informatika Sony Sugema adalah sebuah lembaga yang didedikasikan untuk menjembatani mahasiswa dan alumni dengan Dunia Usaha dan Dunia Industri (DUDI). Dengan misi \'Membangun SDM profesional yang berkualitas tinggi dan memiliki karakter esensial untuk mengatasi tantangan di era globalisasi, serta tetap memiliki kewajiban moral untuk membangun bangsa\', Career Center memberikan layanan karir berupa info lowongan kerja daring (online), info magang (internship), program wirausaha, pelatihan persiapan karir, konseling karir, serta bursa kerja "Integrated Career Days" yang rutin diselenggarakan dua kali setiap tahunnya.',
    'en': 'The Sony Sugema Informatics Technology College Career Center under the Student Affairs Division of Sony Sugema Informatics Technology College is an institution dedicated to bridging students and alumni with the Business and Industrial World (DUDI). With the mission \'Building high-quality professional human resources with essential character to overcome challenges in the globalization era, while maintaining moral obligations to build the nation\', the Career Center provides career services including online job vacancy information, internship information, entrepreneurship programs, career preparation training, career counseling, and "Integrated Career Days" job fairs regularly held twice every year.',
    'ja': 'ソニー・スゲマ情報技術大学学生部の下にあるソニー・スゲマ情報技術大学キャリアセンターは、学生と卒業生をビジネス・産業界（DUDI）と結ぶことに特化した機関です。「グローバル化時代の課題を克服するための本質的な性格を持つ高品質な専門人材を育成し、国家建設への道徳的義務を維持する」という使命のもと、キャリアセンターはオンライン求人情報、インターンシップ情報、起業プログラム、キャリア準備研修、キャリアカウンセリング、年2回定期開催される「統合キャリアデー」就職フェアなどのキャリアサービスを提供しています。'
  },
  
  // About content - paragraph 2
  'about_paragraph_2': {
    'id': 'Selain itu, Career Center juga menjembatani para \'experienced jobseeker\' dan pihak perusahaan dalam memenuhi kebutuhan tenaga profesional. Bagi DUDI sendiri, Career Center memberikan layanan publikasi iklan lowongan kerja dan rekrutmen SDM, di antaranya rekrutmen daring (online), penyelenggaraan rekrutmen kampus, presentasi profil perusahaan, \'company branding\', serta \'career days\' khusus bagi perusahaan.',
    'en': 'In addition, the Career Center also bridges experienced jobseekers and companies in meeting professional workforce needs. For DUDI itself, the Career Center provides job advertisement publication and HR recruitment services, including online recruitment, campus recruitment events, company profile presentations, company branding, and special career days for companies.',
    'ja': 'さらに、キャリアセンターは経験豊富な求職者と企業を結び、専門的な労働力のニーズを満たす橋渡しも行っています。DUDI自体に対して、キャリアセンターは求人広告の公開と人事採用サービスを提供しており、オンライン採用、キャンパス採用イベント、企業プロフィール発表、企業ブランディング、企業向け特別キャリアデーなどがあります。'
  },
  
  // About content - paragraph 3
  'about_paragraph_3': {
    'id': 'Sebagai bagian dari layanan pada masyarakat umum, Career Center membuka kesempatan yang luas bagi para mahasiswa dan alumni perguruan tinggi di luar Sekolah Tinggi Teknologi Informatika Sony Sugema, untuk bergabung dalam keanggotaan \'jobseeker\' di situs Career Center. Anggota \'jobseeker\' akan mendapatkan info terbaru tentang lowongan, program magang, dan berbagai kegiatan rekrutmen di kampus. Dan yang tak kalah menariknya, anggota Career Center dapat masuk ke Titian Karir Terpadu secara gratis*.',
    'en': 'As part of public service, the Career Center opens wide opportunities for students and alumni from universities outside Sony Sugema Informatics Technology College to join as \'jobseeker\' members on the Career Center site. \'Jobseeker\' members will receive the latest information about vacancies, internship programs, and various campus recruitment activities. And equally interesting, Career Center members can access the Integrated Career Bridge for free*.',
    'ja': '公共サービスの一環として、キャリアセンターはソニー・スゲマ情報技術大学以外の大学の学生や卒業生に対して、キャリアセンターサイトでの「求職者」メンバーとして参加する幅広い機会を提供しています。「求職者」メンバーは、空席、インターンシッププログラム、さまざまなキャンパス採用活動に関する最新情報を受け取ることができます。そして同様に興味深いことに、キャリアセンターのメンバーは統合キャリアブリッジに無料でアクセスできます*。'
  },
  
  // Detail Website
  'Detail Website': {
    'id': 'Detail Website:',
    'en': 'Website Details:',
    'ja': 'ウェブサイト詳細:'
  },
  
  // FAQ Items
  'faq_1': {
    'id': 'Bagaimana Cara saya membuat akun di STICKAREER ?',
    'en': 'How do I create an account on STICKAREER?',
    'ja': 'STICKAREERでアカウントを作成するにはどうすればよいですか？'
  },
  'faq_2': {
    'id': 'Apakah Layanan di STICKAREER berbayar ?',
    'en': 'Are STICKAREER services paid?',
    'ja': 'STICKAREERのサービスは有料ですか？'
  },
  'faq_3': {
    'id': 'Bagaimana saya bisa yakin data pribadi saya aman ?',
    'en': 'How can I be sure my personal data is safe?',
    'ja': '個人データが安全であることをどのように確認できますか？'
  },
  'faq_4': {
    'id': 'Apa yang harus saya lakukan ketika lupa kata sandi ?',
    'en': 'What should I do when I forget my password?',
    'ja': 'パスワードを忘れた場合はどうすればよいですか？'
  },
  
  // FAQ Answer
  'faq_answer': {
    'id': 'Jawaban untuk pertanyaan ini akan ditampilkan di sini.',
    'en': 'The answer to this question will be displayed here.',
    'ja': 'この質問の回答がここに表示されます。'
  },
  
  // Form labels
  'Nama': {
    'id': 'Nama',
    'en': 'Name',
    'ja': '名前'
  },
  'Email': {
    'id': 'Email',
    'en': 'Email',
    'ja': 'メール'
  },
  'Subjek': {
    'id': 'Subjek',
    'en': 'Subject',
    'ja': '件名'
  },
  'Pesan': {
    'id': 'Pesan',
    'en': 'Message',
    'ja': 'メッセージ'
  },
  'Kirim Pesan': {
    'id': 'Kirim Pesan',
    'en': 'Send Message',
    'ja': 'メッセージを送信'
  },
  
  // Notification
  'PESAN BERHASIL': {
    'id': 'PESAN BERHASIL',
    'en': 'MESSAGE SENT',
    'ja': 'メッセージ送信'
  },
  'DIKIRIM!!!': {
    'id': 'DIKIRIM!!!',
    'en': 'SUCCESSFULLY!!!',
    'ja': '成功しました！！！'
  },
  'OK': {
    'id': 'OK',
    'en': 'OK',
    'ja': 'OK'
  }
};

const About = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('id');

  // Function to get translation
  const getTranslation = (key: string, lang: string): string => {
    return translations[key]?.[lang] || key;
  };

  // Listen for language changes from navbar
  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    setShowNotification(true);

    setFormData({
      nama: "",
      email: "",
      subjek: "",
      pesan: "",
    });
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // FAQ items with translation keys
  const faqItems = ['faq_1', 'faq_2', 'faq_3', 'faq_4'];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-mx-4 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {getTranslation('PESAN BERHASIL', currentLanguage)}
              <br />
              {getTranslation('DIKIRIM!!!', currentLanguage)}
            </h3>
            <button
              onClick={handleCloseNotification}
              className="bg-blue-900 text-white px-8 py-2 rounded-md hover:bg-blue-800 transition-colors font-medium"
            >
              {getTranslation('OK', currentLanguage)}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tentang Kami */}
        <div className="bg-white rounded-lg border border-gray-300 p-8 mb-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">
              {getTranslation('TENTANG KAMI', currentLanguage)}
            </h1>
          </div>
          <div className="text-sm text-gray-800 leading-relaxed text-justify space-y-4">
            <p>
              {getTranslation('about_paragraph_1', currentLanguage)}
            </p>
            <p>
              {getTranslation('about_paragraph_2', currentLanguage)}
            </p>
            <p>
              {getTranslation('about_paragraph_3', currentLanguage)}
            </p>
            <p>
              {getTranslation('Detail Website', currentLanguage)}{" "}
              <a
                href="https://sttisonysugema.ac.id/"
                target="_blank"
                className="text-blue-700 underline"
              >
                sttisonysugema.ac.id
              </a>
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-blue-900 mb-6 text-center">
            {getTranslation('Pertanyaan yang Sering Diajukan', currentLanguage)}
          </h2>
          <div className="space-y-3">
            {faqItems.map((questionKey, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg border border-gray-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 text-left text-sm font-medium text-gray-900 hover:bg-blue-100 rounded-lg flex items-center justify-between"
                >
                  <span>{getTranslation(questionKey, currentLanguage)}</span>
                  <span className="text-gray-500 text-lg">
                    {openFAQ === index ? "−" : "⌄"}
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="px-4 pb-4 text-sm text-gray-700">
                    {getTranslation('faq_answer', currentLanguage)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-blue-900 mb-6 text-center">
            {getTranslation('Hubungi Kami', currentLanguage)}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('Nama', currentLanguage)}
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('Email', currentLanguage)}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('Subjek', currentLanguage)}
              </label>
              <input
                type="text"
                name="subjek"
                value={formData.subjek}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('Pesan', currentLanguage)}
              </label>
              <textarea
                name="pesan"
                value={formData.pesan}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium"
            >
              {getTranslation('Kirim Pesan', currentLanguage)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;