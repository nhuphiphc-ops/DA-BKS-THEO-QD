export interface AuditLogItem {
  id: number;
  timestamp: string;
  action: string;
  description: string;
  user: string;
  ip: string;
  hash: string;
  prev_hash: string;
  status: 'VERIFIED' | 'TAMPERED';
}

export const AUDIT_LOGS_DATA: AuditLogItem[] = [
  {
    "id": 12,
    "timestamp": "24/09/2026 20:15:00",
    "action": "SUSPICIOUS_BLOCK",
    "description": "Chặn truy cập vượt quyền /users/:id/delete từ IP lạ",
    "user": "anonymous",
    "ip": "103.149.28.11",
    "hash": "8d4f801de3aa2f30acd2673e00c089f5dca00aef50b9712b572598cfc7667725",
    "prev_hash": "1106bddc1122b5ec93c020d967ef4f15b8ede36465857b3ea10060494ad1dd09",
    "status": "VERIFIED"
  },
  {
    "id": 11,
    "timestamp": "24/09/2026 20:00:00",
    "action": "LOGIN_FAILED",
    "description": "Sai mật khẩu tài khoản kiemsoat2@phuchung.com.vn",
    "user": "kiemsoat2@phuchung.com.vn",
    "ip": "42.115.88.201",
    "hash": "1106bddc1122b5ec93c020d967ef4f15b8ede36465857b3ea10060494ad1dd09",
    "prev_hash": "ee5f409c0dc05e5901b7aee5254ab00cd073c7c3ec1963c70aaa7eb1961c5835",
    "status": "VERIFIED"
  },
  {
    "id": 10,
    "timestamp": "24/09/2026 19:45:00",
    "action": "UPDATE_ROLE",
    "description": "Phân quyền KSV Ban Kiểm soát cho Đào Đức Tài",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "ee5f409c0dc05e5901b7aee5254ab00cd073c7c3ec1963c70aaa7eb1961c5835",
    "prev_hash": "fab790e74a0b060352b9ef4c76fb2f068b15cde607c45771a5541d42152197f1",
    "status": "VERIFIED"
  },
  {
    "id": 9,
    "timestamp": "24/09/2026 19:30:00",
    "action": "INVITE_MEMBER",
    "description": "Mời thành viên mới ductaikt53a@gmail.com",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "fab790e74a0b060352b9ef4c76fb2f068b15cde607c45771a5541d42152197f1",
    "prev_hash": "24d71f3e8caba71e74c53773a720351e310fb0e498fc4b7774a04e956dd41827",
    "status": "VERIFIED"
  },
  {
    "id": 8,
    "timestamp": "24/09/2026 19:15:00",
    "action": "DOWNLOAD_EVIDENCE",
    "description": "Tạo Secure Download Token cho REQ-M1-01",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "24d71f3e8caba71e74c53773a720351e310fb0e498fc4b7774a04e956dd41827",
    "prev_hash": "f715319895ee7e75c0ce67e825c2e3b933b35c8868744bb939d34e63c6c93ff1",
    "status": "VERIFIED"
  },
  {
    "id": 7,
    "timestamp": "24/09/2026 19:00:00",
    "action": "UPLOAD_EVIDENCE",
    "description": "Tải lên BCTC Q2/2026 mã hóa AES-256",
    "user": "nguyenductai@phuchung.com.vn",
    "ip": "14.238.102.45",
    "hash": "f715319895ee7e75c0ce67e825c2e3b933b35c8868744bb939d34e63c6c93ff1",
    "prev_hash": "9537db1ab2ce6de7d4202f1e5f08a0996c0da0b5699a22e9b4ff52006bb99552",
    "status": "VERIFIED"
  },
  {
    "id": 6,
    "timestamp": "24/09/2026 18:45:00",
    "action": "UPDATE_RISK",
    "description": "Cập nhật mức độ Rủi ro RR-2026-001 -> NGHIÊM TRỌNG",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "9537db1ab2ce6de7d4202f1e5f08a0996c0da0b5699a22e9b4ff52006bb99552",
    "prev_hash": "5cc72985029b448b99806f05fcbcdafb1f62b6133f2c24b781130fb445c1a5c5",
    "status": "VERIFIED"
  },
  {
    "id": 5,
    "timestamp": "24/09/2026 18:30:00",
    "action": "CREATE_PLAN",
    "description": "Tạo Kế hoạch Giám sát NQ-01/2026/DHDCD",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "5cc72985029b448b99806f05fcbcdafb1f62b6133f2c24b781130fb445c1a5c5",
    "prev_hash": "52b752cbabc950bc6e5a60d87c20e59c6e0c3ea619ccb06cf1f02b8d9ceede36",
    "status": "VERIFIED"
  },
  {
    "id": 4,
    "timestamp": "24/09/2026 18:15:00",
    "action": "VIEW_FINANCIALS",
    "description": "Xem đối soát Bảng kê Gamuda HH2 (11.4 tỷ)",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "52b752cbabc950bc6e5a60d87c20e59c6e0c3ea619ccb06cf1f02b8d9ceede36",
    "prev_hash": "23ad4f1228851e1cd92907a74915f4a92ef8f3116393a38234ff5c026ff50a06",
    "status": "VERIFIED"
  },
  {
    "id": 3,
    "timestamp": "24/09/2026 18:00:00",
    "action": "EXPORT_REPORT",
    "description": "Xuất báo cáo Tổng quan thiết bị ECONS (Excel)",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "23ad4f1228851e1cd92907a74915f4a92ef8f3116393a38234ff5c026ff50a06",
    "prev_hash": "bc0726f425ec9bf420a6e9c500a104b4ec1027b8d29b423343f310fa6ee972df",
    "status": "VERIFIED"
  },
  {
    "id": 2,
    "timestamp": "24/09/2026 17:45:00",
    "action": "VIEW_DASHBOARD",
    "description": "Truy cập Trung tâm Giám sát Điều hành",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "bc0726f425ec9bf420a6e9c500a104b4ec1027b8d29b423343f310fa6ee972df",
    "prev_hash": "a0d5d3939c67e1bee15c16cac2c229f2ad46883742f74bcceddf13f92554d463",
    "status": "VERIFIED"
  },
  {
    "id": 1,
    "timestamp": "24/09/2026 17:30:00",
    "action": "LOGIN_SUCCESS",
    "description": "Hệ thống Xác thực /auth/login",
    "user": "admin@phuchung.com.vn",
    "ip": "118.70.190.12",
    "hash": "a0d5d3939c67e1bee15c16cac2c229f2ad46883742f74bcceddf13f92554d463",
    "prev_hash": "0000000000000000000000000000000000000000000000000000000000000000",
    "status": "VERIFIED"
  }
];
