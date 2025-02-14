import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ 업로드 폴더가 없으면 자동 생성
const uploadDir = "uploads/profile/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// ✅ `uploads/profile/` 폴더에 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // 파일 확장자 추출
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`); // 랜덤 파일명 생성
  }
});

// ✅ 파일 필터 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("허용되지 않는 파일 형식입니다."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB 제한
});
