"use client";

import { useState, useEffect } from "react";
import { Plus, X, Upload } from "lucide-react";

type SkillFormData = {
  nama: string;
  level?: string;
  deskripsi?: string;
};

type Props = {
  mode: "add" | "edit";
  initialData?: SkillFormData;
  onCancel: () => void;
  onSave: (data: SkillFormData) => void;
};

// Translation object
const translations = {
  // Form labels
  skills: {
    id: 'Keterampilan',
    en: 'Skills',
    ja: 'スキル'
  },
  required: {
    id: '*',
    en: '*',
    ja: '*'
  },
  portfolioOnline: {
    id: 'Portofolio Online & Tautan Terkait',
    en: 'Online Portfolio & Related Links',
    ja: 'オンラインポートフォリオ＆関連リンク'
  },
  uploadSupportingFiles: {
    id: 'Unggah File Pendukung',
    en: 'Upload Supporting Files',
    ja: 'サポートファイルをアップロード'
  },
  
  // Placeholders
  skillPlaceholder: {
    id: 'Contoh: HTML, CSS, Data Science',
    en: 'Example: HTML, CSS, Data Science',
    ja: '例：HTML、CSS、データサイエンス'
  },
  linkPlaceholder: {
    id: 'https://example.com/portfolio',
    en: 'https://example.com/portfolio',
    ja: 'https://example.com/portfolio'
  },
  
  // Buttons
  add: {
    id: 'Tambah',
    en: 'Add',
    ja: '追加'
  },
  addAnotherLink: {
    id: 'Tambah Tautan Lain',
    en: 'Add Another Link',
    ja: '別のリンクを追加'
  },
  cancel: {
    id: 'Batal',
    en: 'Cancel',
    ja: 'キャンセル'
  },
  saveChanges: {
    id: 'Simpan Perubahan',
    en: 'Save Changes',
    ja: '変更を保存'
  },
  saving: {
    id: 'Menyimpan...',
    en: 'Saving...',
    ja: '保存中...'
  },
  uploadFile: {
    id: 'Unggah File',
    en: 'Upload File',
    ja: 'ファイルをアップロード'
  },
  deleteSkill: {
    id: 'Hapus skill',
    en: 'Delete skill',
    ja: 'スキルを削除'
  },
  deleteLink: {
    id: 'Hapus link',
    en: 'Delete link',
    ja: 'リンクを削除'
  },
  deleteFile: {
    id: 'Hapus file',
    en: 'Delete file',
    ja: 'ファイルを削除'
  },
  
  // Skill levels
  beginner: {
    id: 'Beginner',
    en: 'Beginner',
    ja: '初級'
  },
  intermediate: {
    id: 'Intermediate',
    en: 'Intermediate',
    ja: '中級'
  },
  advanced: {
    id: 'Advanced',
    en: 'Advanced',
    ja: '上級'
  },
  expert: {
    id: 'Expert',
    en: 'Expert',
    ja: 'エキスパート'
  },
  
  // Messages
  noSkillsAdded: {
    id: 'Belum ada keterampilan yang ditambahkan',
    en: 'No skills added yet',
    ja: 'まだスキルが追加されていません'
  },
  selectLevelHint: {
    id: 'Pilih level untuk setiap keterampilan sebelum menyimpan',
    en: 'Select level for each skill before saving',
    ja: '保存する前に各スキルのレベルを選択してください'
  },
  addLinks: {
    id: 'Tambahkan Tautan',
    en: 'Add Links',
    ja: 'リンクを追加'
  },
  dragAndDrop: {
    id: 'atau tarik & seret',
    en: 'or drag & drop',
    ja: 'またはドラッグ＆ドロップ'
  },
  maxSize: {
    id: 'Maksimal',
    en: 'Maximum',
    ja: '最大'
  },
  format: {
    id: 'Format',
    en: 'Format',
    ja: 'フォーマット'
  },
  filesOptional: {
    id: 'File bersifat opsional, tetapi sangat direkomendasikan untuk melengkapi profil Anda',
    en: 'Files are optional, but highly recommended to complete your profile',
    ja: 'ファイルはオプションですが、プロフィールを完成させるために強く推奨されます'
  },
  
  // File types
  portfolioFile: {
    id: 'Portfolio File',
    en: 'Portfolio File',
    ja: 'ポートフォリオファイル'
  },
  curriculumVitae: {
    id: 'Curriculum Vitae',
    en: 'Curriculum Vitae',
    ja: '履歴書'
  },
  coverLetter: {
    id: 'Cover Letter',
    en: 'Cover Letter',
    ja: 'カバーレター'
  },
  
  // File descriptions
  portfolioDesc: {
    id: 'Unggah portfolio Anda dalam format PDF atau DOC/DOCX (maks 100MB)',
    en: 'Upload your portfolio in PDF or DOC/DOCX format (max 100MB)',
    ja: 'ポートフォリオをPDFまたはDOC/DOCX形式でアップロード（最大100MB）'
  },
  cvDesc: {
    id: 'Unggah CV Anda dalam format PDF atau DOC/DOCX (maks 100MB)',
    en: 'Upload your CV in PDF or DOC/DOCX format (max 100MB)',
    ja: '履歴書をPDFまたはDOC/DOCX形式でアップロード（最大100MB）'
  },
  coverLetterDesc: {
    id: 'Unggah surat lamaran dalam format PDF atau DOC/DOCX (maks 100MB)',
    en: 'Upload cover letter in PDF or DOC/DOCX format (max 100MB)',
    ja: 'カバーレターをPDFまたはDOC/DOCX形式でアップロード（最大100MB）'
  },
  
  // Error messages
  fileTypeNotAllowed: {
    id: 'Tipe file tidak diizinkan!',
    en: 'File type not allowed!',
    ja: 'ファイルタイプが許可されていません！'
  },
  onlyAllowed: {
    id: 'Hanya diperbolehkan: PDF, DOC, DOCX',
    en: 'Only allowed: PDF, DOC, DOCX',
    ja: '許可されているのは：PDF、DOC、DOCX'
  },
  fileTooLarge: {
    id: 'Ukuran file terlalu besar!',
    en: 'File size too large!',
    ja: 'ファイルサイズが大きすぎます！'
  },
  maxFileSize: {
    id: 'Maksimal: 100 MB',
    en: 'Maximum: 100 MB',
    ja: '最大：100 MB'
  },
  addMinimumSkill: {
    id: 'Mohon tambahkan minimal satu keterampilan',
    en: 'Please add at least one skill',
    ja: '少なくとも1つのスキルを追加してください'
  },
  notLoggedIn: {
    id: 'Anda belum login. Silakan login terlebih dahulu.',
    en: 'You are not logged in. Please login first.',
    ja: 'ログインしていません。最初にログインしてください。'
  },
  uploadingFiles: {
    id: 'Uploading files...',
    en: 'Uploading files...',
    ja: 'ファイルをアップロード中...'
  },
  postingSkills: {
    id: 'Posting skills...',
    en: 'Posting skills...',
    ja: 'スキルを投稿中...'
  },
  failedToSaveAll: {
    id: 'Gagal menyimpan semua keterampilan',
    en: 'Failed to save all skills',
    ja: 'すべてのスキルの保存に失敗しました'
  },
  partiallySaved: {
    id: 'Sebagian data berhasil disimpan',
    en: 'Some data saved successfully',
    ja: '一部のデータが正常に保存されました'
  },
  successful: {
    id: 'Berhasil',
    en: 'Successful',
    ja: '成功'
  },
  failed: {
    id: 'Gagal',
    en: 'Failed',
    ja: '失敗'
  },
  allSavedSuccess: {
    id: 'Semua keterampilan dan file berhasil disimpan!',
    en: 'All skills and files saved successfully!',
    ja: 'すべてのスキルとファイルが正常に保存されました！'
  },
  errorSaving: {
    id: 'Terjadi kesalahan saat menyimpan data.',
    en: 'An error occurred while saving data.',
    ja: 'データの保存中にエラーが発生しました。'
  },
  tokenExpiredLogin: {
    id: 'Token Anda mungkin sudah kadaluarsa. Silakan login ulang.',
    en: 'Your token may have expired. Please login again.',
    ja: 'トークンが期限切れの可能性があります。再度ログインしてください。'
  },
  endpointNotFound: {
    id: 'Endpoint API tidak ditemukan. Mungkin ada masalah dengan server atau URL API.',
    en: 'API endpoint not found. There may be an issue with the server or API URL.',
    ja: 'APIエンドポイントが見つかりません。サーバーまたはAPI URLに問題がある可能性があります。'
  },
  serverError: {
    id: 'Terjadi kesalahan di server. Silakan coba lagi nanti.',
    en: 'A server error occurred. Please try again later.',
    ja: 'サーバーエラーが発生しました。後でもう一度お試しください。'
  },
  checkConnection: {
    id: 'Periksa koneksi internet Anda dan coba lagi.',
    en: 'Check your internet connection and try again.',
    ja: 'インターネット接続を確認してもう一度お試しください。'
  },
  failedToSave: {
    id: 'Gagal menyimpan data',
    en: 'Failed to save data',
    ja: 'データの保存に失敗しました'
  },
  
  // Debug
  debugInfo: {
    id: 'Debug Info:',
    en: 'Debug Info:',
    ja: 'デバッグ情報：'
  },
  tokenAvailable: {
    id: 'Token tersedia',
    en: 'Token available',
    ja: 'トークン利用可能'
  },
  yes: {
    id: 'Ya',
    en: 'Yes',
    ja: 'はい'
  },
  no: {
    id: 'Tidak',
    en: 'No',
    ja: 'いいえ'
  },
  skillCount: {
    id: 'Jumlah skills',
    en: 'Skill count',
    ja: 'スキル数'
  },
  filesUploaded: {
    id: 'Files terupload',
    en: 'Files uploaded',
    ja: 'アップロードされたファイル'
  },
  skillsAndLevels: {
    id: 'Skills & Levels:',
    en: 'Skills & Levels:',
    ja: 'スキル＆レベル：'
  },
  file: {
    id: 'File',
    en: 'File',
    ja: 'ファイル'
  },
  type: {
    id: 'Tipe',
    en: 'Type',
    ja: 'タイプ'
  },
  size: {
    id: 'Ukuran',
    en: 'Size',
    ja: 'サイズ'
  }
};

export default function KeterampilanForm({
  mode,
  initialData,
  onCancel,
  onSave,
}: Props) {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(
    initialData?.nama ? initialData.nama.split(", ") : []
  );
  const [skillLevels, setSkillLevels] = useState<{ [key: string]: string }>({});
  const [links, setLinks] = useState([""]);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('id');

  const API_BASE_URL = 'https://backendstticareer-123965511401.asia-southeast2.run.app';

  // Translation helper function
  const t = (key: keyof typeof translations): string => {
    return translations[key]?.[currentLanguage as 'id' | 'en' | 'ja'] || translations[key]?.['id'] || key;
  };

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    
    const possibleKeys = ['jwt_token', 'token', 'authToken', 'accessToken'];
    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token && token !== 'YOUR_JWT_TOKEN' && token.length > 10) {
        return token;
      }
    }
    return null;
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkill = skillInput.trim();
      setSkills([...skills, newSkill]);
      setSkillLevels({ ...skillLevels, [newSkill]: "Beginner" });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
    const newSkillLevels = { ...skillLevels };
    delete newSkillLevels[skillToRemove];
    setSkillLevels(newSkillLevels);
  };

  const updateSkillLevel = (skill: string, level: string) => {
    setSkillLevels({ ...skillLevels, [skill]: level });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (idx: number, file: File | null) => {
    if (file) {
      // Validasi untuk files (dokumen)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        alert(`${t('fileTypeNotAllowed')}\n\n${t('file')}: ${file.name}\n${t('type')}: ${file.type}\n\n${t('onlyAllowed')}`);
        return;
      }
      
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`${t('fileTooLarge')}\n\n${t('file')}: ${file.name}\n${t('size')}: ${(file.size / 1024 / 1024).toFixed(2)} MB\n\n${t('maxFileSize')}`);
        return;
      }
    }
    
    const newFiles = [...files];
    newFiles[idx] = file;
    setFiles(newFiles);
  };

  const postSkillToAPI = async (skillName: string, skillLevel: string) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error(t('notLoggedIn'));
    }

    try {
      console.log(`Posting skill: ${skillName} with level: ${skillLevel}`);
      
      const response = await fetch(`${API_BASE_URL}/api/profile/skill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          skill_name: skillName,
          skill_level: skillLevel
        })
      });

      console.log(`Response status for ${skillName}:`, response.status);

      if (!response.ok) {
        let errorMessage = `Failed to post skill: ${skillName} (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          console.error(`Error response for ${skillName}:`, errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const responseText = await response.text();
          console.error(`Non-JSON error response for ${skillName}:`, responseText);
          errorMessage = responseText || `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`Successfully posted skill ${skillName}:`, result);
      return result;
      
    } catch (error) {
      console.error(`Error posting skill ${skillName}:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error - possible CORS or connection issue');
        throw new Error(`Network error saat posting skill ${skillName}. ${t('checkConnection')}`);
      }
      
      throw error;
    }
  };

  const uploadFiles = async () => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error(t('notLoggedIn'));
    }

    const formData = new FormData();
    
    if (files[0]) {
      console.log('Adding portfolio_file:', files[0].name, files[0].type);
      formData.append('portfolio_file', files[0]);
    }
    if (files[1]) {
      console.log('Adding cv_file:', files[1].name, files[1].type);
      formData.append('cv_file', files[1]);
    }
    if (files[2]) {
      console.log('Adding cover_letter_file:', files[2].name, files[2].type);
      formData.append('cover_letter_file', files[2]);
    }

    const hasFiles = files.some(f => f !== null);
    if (!hasFiles) {
      console.log('No files to upload');
      return null;
    }

    console.log('Files to upload:', {
      portfolio: files[0]?.name,
      cv: files[1]?.name,
      cover_letter: files[2]?.name
    });

    try {
      console.log('Sending file upload request to /api/profile/upload-files...');
      const response = await fetch(`${API_BASE_URL}/api/profile/upload-files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      console.log('Upload files response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to upload files';
        try {
          const errorData = await response.json();
          console.error('Upload files error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const responseText = await response.text();
          console.error('Non-JSON upload files error:', responseText);
          errorMessage = responseText || `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload files success:', result);
      return result;
    } catch (error) {
      console.error('Error uploading files:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error saat upload files. ${t('checkConnection')}`);
      }
      
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (skills.length === 0) {
      alert(t('addMinimumSkill'));
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert(t('notLoggedIn'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload files (dokumen) ke /api/profile/upload-files
      let filesUploadResult = null;
      if (files.some(f => f !== null)) {
        console.log(t('uploadingFiles'));
        filesUploadResult = await uploadFiles();
        console.log("Files uploaded successfully:", filesUploadResult);
      }

      // Post skills ke /api/profile/skill
      console.log(t('postingSkills'));
      const skillErrors: string[] = [];
      const successfulSkills: string[] = [];
      
      for (const skill of skills) {
        try {
          const level = skillLevels[skill] || "Beginner";
          console.log(`Posting skill: ${skill} with level: ${level}`);
          await postSkillToAPI(skill, level);
          successfulSkills.push(skill);
          console.log(`Successfully posted: ${skill}`);
        } catch (error) {
          console.error(`Failed to post skill: ${skill}`, error);
          skillErrors.push(`${skill}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (skillErrors.length > 0 && successfulSkills.length === 0) {
        throw new Error(`${t('failedToSaveAll')}:\n\n${skillErrors.join('\n')}`);
      } else if (skillErrors.length > 0) {
        console.warn('Some skills failed to post:', skillErrors);
        alert(`${t('partiallySaved')}:\n\n${t('successful')}: ${successfulSkills.join(', ')}\n\n${t('failed')}: ${skillErrors.join('\n')}`);
      } else {
        console.log("Successfully posted all skills:", successfulSkills);
      }
      
      onSave({ nama: skills.join(", ") });
      
      if (skillErrors.length === 0) {
        alert(t('allSavedSuccess'));
      }
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      
      let errorMessage = t('errorSaving');
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        errorMessage += `\n\n${t('tokenExpiredLogin')}`;
      } else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        errorMessage += `\n\n${t('endpointNotFound')}`;
      } else if (errorMessage.includes("500")) {
        errorMessage += `\n\n${t('serverError')}`;
      } else if (errorMessage.includes("Network error") || errorMessage.includes("fetch")) {
        errorMessage += `\n\n${t('checkConnection')}`;
      }
      
      alert(`${t('failedToSave')}:\n\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('skills')} <span className="text-red-500">{t('required')}</span>
        </label>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('skillPlaceholder')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addSkill}
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition-colors"
          >
            {t('add')}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 gap-2"
            >
              <span className="font-semibold">{skill}</span>
              <select
                value={skillLevels[skill] || "Beginner"}
                onChange={(e) => updateSkillLevel(skill, e.target.value)}
                className="text-xs bg-white border border-green-300 rounded px-2 py-0.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
              >
                <option value="Beginner">{t('beginner')}</option>
                <option value="Intermediate">{t('intermediate')}</option>
                <option value="Advanced">{t('advanced')}</option>
                <option value="Expert">{t('expert')}</option>
              </select>
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:text-green-600 transition-colors"
                title={t('deleteSkill')}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              {t('noSkillsAdded')}
            </p>
          )}
        </div>
        
        {skills.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {t('selectLevelHint')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('portfolioOnline')}
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t('addLinks')}</label>
            {links.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updateLink(idx, e.target.value)}
                  placeholder={t('linkPlaceholder')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                    title={t('deleteLink')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" /> 
              {t('addAnotherLink')}
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          {t('uploadSupportingFiles')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: t('portfolioFile'),
              desc: t('portfolioDesc'),
              maxSize: "100MB",
              accept: ".pdf,.doc,.docx",
              formats: "PDF, DOC, DOCX"
            },
            {
              title: t('curriculumVitae'), 
              desc: t('cvDesc'),
              maxSize: "100MB",
              accept: ".pdf,.doc,.docx",
              formats: "PDF, DOC, DOCX"
            },
            {
              title: t('coverLetter'),
              desc: t('coverLetterDesc'), 
              maxSize: "100MB",
              accept: ".pdf,.doc,.docx",
              formats: "PDF, DOC, DOCX"
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                {item.title}
              </h4>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                {item.desc}
              </p>
              
              <label className="block cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept={item.accept}
                  onChange={(e) =>
                    handleFileChange(idx, e.target.files?.[0] || null)
                  }
                />
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-xs text-center">
                    <span className="text-blue-600 hover:underline font-medium">
                      {t('uploadFile')}
                    </span>{" "}
                    {t('dragAndDrop')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('maxSize')} {item.maxSize}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t('format')}: {item.formats}
                  </p>
                </div>
              </label>
              
              {files[idx] && (
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200 relative">
                  <div className="pr-6">
                    <p className="text-xs text-blue-800 font-medium truncate">
                      {files[idx]?.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {((files[idx]?.size || 0) / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => handleFileChange(idx, null)}
                    className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                    title={t('deleteFile')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {t('filesOptional')}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          type="button"
          className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || skills.length === 0}
          className="px-6 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {t('saving')}
            </span>
          ) : (
            t('saveChanges')
          )}
        </button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs space-y-2">
          <p className="font-bold mb-2">{t('debugInfo')}</p>
          <div className="grid grid-cols-2 gap-2">
            <p>{t('tokenAvailable')}: {getAuthToken() ? t('yes') : t('no')}</p>
            <p>{t('skillCount')}: {skills.length}</p>
            <p>{t('filesUploaded')}: {files.filter(f => f !== null).length}/3</p>
            <p>API Base URL: {API_BASE_URL}</p>
          </div>
          <div className="mt-2 p-2 bg-white rounded">
            <p className="font-semibold">{t('skillsAndLevels')}</p>
            {skills.map(skill => (
              <p key={skill} className="text-xs">
                {skill}: {skillLevels[skill] || 'Beginner'}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}