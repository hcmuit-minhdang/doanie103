use IE103_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE audit_log;
TRUNCATE TABLE payment_history;
TRUNCATE TABLE feedback_ticket;
TRUNCATE TABLE dossier_transfer;
TRUNCATE TABLE authorization;
TRUNCATE TABLE attachment;
TRUNCATE TABLE dossier;
TRUNCATE TABLE visit_log;
TRUNCATE TABLE official;
TRUNCATE TABLE agency;
TRUNCATE TABLE gift_category;
TRUNCATE TABLE campaign;
TRUNCATE TABLE citizen_allowance;
TRUNCATE TABLE allowance_regime;
TRUNCATE TABLE living_condition;
TRUNCATE TABLE household_member;
TRUNCATE TABLE household;
TRUNCATE TABLE medical_snapshot;
TRUNCATE TABLE health_insurance;
TRUNCATE TABLE bank_account;
TRUNCATE TABLE bank;
TRUNCATE TABLE object_mapping;
TRUNCATE TABLE policy_object;
TRUNCATE TABLE citizen;
TRUNCATE TABLE ward;
TRUNCATE TABLE district;
TRUNCATE TABLE province;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO province (province_id, province_name) VALUES 
('P79', 'Thành phố Hồ Chí Minh'),
('P01', 'Thành phố Hà Nội'),
('P48', 'Thành phố Đà Nẵng');

INSERT INTO district (district_id, province_id, district_name) VALUES 
('D760', 'P79', 'Quận 1'),
('D764', 'P79', 'Quận Gò Vấp'),
('D001', 'P01', 'Quận Ba Đình'),
('D490', 'P48', 'Quận Hải Châu');

INSERT INTO ward (ward_id, district_id, ward_name) VALUES 
('W26300', 'D760', 'Phường Bến Nghé'),
('W26303', 'D760', 'Phường Bến Thành'),
('W26800', 'D764', 'Phường 1'),
('W00001', 'D001', 'Phường Điện Biên'),
('W10001', 'D490', 'Phường Hòa Cường Bắc');

INSERT INTO citizen (citizen_id, cccd_number, full_name, dob, gender, ward_id, address_detail) VALUES

(1, '079090123456', 'Lê Thanh Hùng', '1965-04-12', 'M', 'W26300', '12 Lê Lợi, Bến Nghé, Q1'),
(7, '079095000001', 'Lê Thanh Hải', '1992-06-20', 'M', 'W26300', '12 Lê Lợi, Bến Nghé, Q1'),
(18, '079095000012', 'Nguyễn Hoàng Long', '1975-01-01', 'M', 'W26300', '12 Lê Lợi, Bến Nghé, Q1'),
(19, '079095000013', 'Nguyễn Văn Hùng', '1963-04-05', 'M', 'W26300', '12 Lê Lợi, Bến Nghé, Q1'),

(2, '010806543210', 'Trần Thị Lan', '1970-08-15', 'F', 'W26300', '45 Nguyễn Huệ, Bến Nghé, Q1'),
(11, '079095000005', 'Lê Bảo', '1968-01-25', 'M', 'W26300', '45 Nguyễn Huệ, Bến Nghé, Q1'),

(3, '048070111222', 'Phạm Văn Mạnh', '1958-11-20', 'M', 'W26303', '78 Lý Tự Trọng, Bến Thành, Q1'),
(10, '079095000004', 'Phạm Khoa', '1962-07-22', 'M', 'W26303', '78 Lý Tự Trọng, Bến Thành, Q1'),
(13, '079095000007', 'Phan Gia Bảo', '1948-02-28', 'M', 'W26303', '78 Lý Tự Trọng, Bến Thành, Q1'),
(14, '079095000008', 'Võ Minh Quân', '1960-05-18', 'M', 'W26303', '78 Lý Tự Trọng, Bến Thành, Q1'),
(15, '079095000009', 'Trịnh Bá Hiếu', '1952-09-09', 'M', 'W26303', '78 Lý Tự Trọng, Bến Thành, Q1'),

(4, '079060999888', 'Nguyễn Bích Ngọc', '1945-09-02', 'F', 'W26800', '112 Quang Trung, Phường 1, Gò Vấp'),
(20, '079095000014', 'Đỗ Thị Mai', '1982-08-30', 'F', 'W26800', '112 Quang Trung, Phường 1, Gò Vấp'),
(21, '079095000015', 'Bùi Xuân Phái', '1950-12-12', 'M', 'W26800', '112 Quang Trung, Phường 1, Gò Vấp'),

(5, '031050777666', 'Đỗ Tấn Phát', '1950-10-10', 'M', 'W00001', '205 Điện Biên, Điện Biên, Ba Đình, Hà Nội'),
(9, '079095000003', 'Đỗ Mai Lan', '1980-03-15', 'F', 'W00001', '205 Điện Biên, Điện Biên, Ba Đình, Hà Nội'),

(6, '034090555444', 'Vũ Tuấn Anh', '1995-05-05', 'M', 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu'),
(12, '079095000006', 'Vũ Thị Hương', '1990-11-12', 'F', 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu'),
(16, '079095000010', 'Dương Trung Quốc', '1947-10-15', 'M', 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu'),
(17, '079095000011', 'Nguyễn Huệ', '1955-03-20', 'F', 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu'),
(22, '079095000016', 'Phạm Văn Đồng', '1955-05-19', 'M', 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu'),
(23, '079095000017', 'Nguyễn Thị Sáu', '1938-04-30', 'F', 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu'),

(8, '079095000002', 'Trần Văn Nam', '1988-12-05', 'M', 'W26300', '33 Đồng Khởi, Bến Nghé, Q1'),

(24, '079095000024', 'Lê Văn Thử Nghiệm', '1990-01-01', 'M', 'W26300', '12 Lê Lợi, Bến Nghé, Q1');

INSERT INTO policy_object (object_id, object_name, description) VALUES
(1, 'Thương binh', 'Thương binh suy giảm khả năng lao động do chiến đấu'),
(2, 'Thân nhân Liệt sĩ', 'Thân nhân trực tiếp của Liệt sĩ (Vợ, chồng, con ruột)'),
(3, 'Người HĐKC bị nhiễm CĐHH', 'Người hoạt động kháng chiến bị nhiễm chất độc hóa học'),
(4, 'Bà mẹ Việt Nam Anh hùng', 'Bà mẹ Việt Nam Anh hùng được phong tặng'),
(5, 'Bệnh binh', 'Bệnh binh suy giảm khả năng lao động do bệnh tật trong quân ngũ'),
(6, 'Con đẻ người nhiễm CĐHH', 'Con đẻ của người hoạt động kháng chiến bị nhiễm chất độc hóa học'),
(7, 'Hộ nghèo', 'Hộ gia đình có thu nhập dưới chuẩn nghèo quy định');

INSERT INTO object_mapping (citizen_id, object_id, start_date, end_date, status) VALUES
(1, 1, '2010-01-01', NULL, 'active'), 
(2, 2, '2005-06-15', NULL, 'active'), 
(3, 3, '2015-08-20', NULL, 'active'), 
(4, 4, '2018-09-02', NULL, 'active'), 
(5, 5, '2012-10-10', '2025-10-10', 'active'), 
(6, 6, '2020-05-05', NULL, 'active'), 
(7, 1, '2015-01-01', NULL, 'active'), 
(8, 7, '2019-03-01', NULL, 'active'), 
(9, 2, '2021-02-15', NULL, 'active'), 
(10, 3, '2016-04-10', NULL, 'active'), 
(11, 1, '2012-07-01', NULL, 'active'), 
(12, 6, '2022-09-12', NULL, 'active'), 
(13, 1, '2015-07-27', NULL, 'active'), 
(14, 7, '2021-01-01', NULL, 'active'), 
(15, 3, '2010-04-30', NULL, 'active'), 
(16, 5, '2013-05-19', NULL, 'active'), 
(17, 2, '2008-12-22', NULL, 'active'), 
(18, 1, '2014-06-01', NULL, 'active'), 
(19, 3, '2011-08-20', NULL, 'active'), 
(20, 7, '2022-02-28', NULL, 'active'), 
(21, 5, '2015-12-12', NULL, 'active'), 
(22, 1, '2016-05-19', NULL, 'active'), 
(23, 2, '2018-06-15', NULL, 'active'); 

INSERT INTO bank (bank_id, bank_code, bank_name) VALUES
(1, 'VCB', 'Vietcombank - Ngân hàng Ngoại thương Việt Nam'),
(2, 'BIDV', 'BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam'),
(3, 'CTG', 'VietinBank - Ngân hàng Công thương Việt Nam'),
(4, 'ARG', 'Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn');

INSERT INTO bank_account (citizen_id, bank_id, account_number, account_holder, is_default) VALUES
(1, 1, '1000000001', 'LE THANH HUNG', 1),
(2, 2, '2000000002', 'TRAN THI LAN', 1),
(3, 3, '3000000003', 'PHAM VAN MANH', 1),
(4, 1, '1000000004', 'NGUYEN BICH NGOC', 1),
(5, 4, '4000000005', 'DO TAN PHAT', 1),
(6, 2, '2000000006', 'VU TUAN ANH', 1),
(7, 1, '1000000007', 'LE THANH HAI', 1),
(8, 2, '2000000008', 'TRAN VAN NAM', 1),
(9, 4, '4000000009', 'DO MAI LAN', 1),
(10, 3, '3000000010', 'PHAM KHOA', 1),
(11, 1, '1000000011', 'LE BAO', 1),
(12, 2, '2000000012', 'VU THI HUONG', 1),
(13, 3, '3000000013', 'PHAN GIA BAO', 1),
(14, 1, '1000000014', 'VO MINH QUAN', 1),
(15, 2, '2000000015', 'TRINH BA HIEU', 1),
(16, 4, '4000000016', 'DUONG TRUNG QUOC', 1),
(17, 2, '2000000017', 'NGUYEN HUE', 1),
(18, 1, '1000000018', 'NGUYEN HOANG LONG', 1),
(19, 3, '3000000019', 'NGUYEN VAN HUNG', 1),
(20, 1, '1000000020', 'DO THI MAI', 1);

INSERT INTO health_insurance (citizen_id, insurance_code, benefit_level, hospital_code) VALUES
(1, 'HT2790123456', 100, 'BV Quân Y 175'),
(2, 'CB2790654321', 95, 'BV Chợ Rẫy'),
(3, 'HT2790111222', 100, 'Trung tâm Y tế Q10'),
(4, 'HT2790999888', 100, 'BV Thống Nhất'),
(5, 'CB2790777666', 95, 'BV Nhân dân 115'),
(6, 'HT2790555444', 80, 'Trung tâm Y tế Q1'),
(7, 'HT2790000001', 90, 'BV Bình Dân'),
(8, 'HT2790000002', 80, 'BV Gia Định'),
(9, 'HT2790000003', 95, 'BV Bạch Mai'),
(10, 'HT2790000004', 100, 'BV 108 Hà Nội'),
(11, 'HT2790000005', 90, 'BV Quân Y 175'),
(12, 'HT2790000006', 80, 'BV Đà Nẵng'),
(13, 'HT2790000007', 100, 'BV C Đà Nẵng'),
(14, 'HT2790000008', 70, 'Trung tâm Y tế Hải Châu'),
(15, 'HT2790000009', 100, 'BV Thống Nhất'),
(16, 'HT2790000010', 95, 'BV Hoàn Mỹ Đà Nẵng'),
(17, 'HT2790000011', 100, 'BV Quân Y 175'),
(18, 'HT2790000012', 90, 'BV Chợ Rẫy'),
(19, 'HT2790000013', 95, 'BV Bình Dân'),
(20, 'HT2790000014', 75, 'Trung tâm Y tế Gò Vấp');

INSERT INTO medical_snapshot (citizen_id, health_status, recorded_at) VALUES
(1, 'Ổn định', '2026-05-24 09:00:00'),
(2, 'Yêu cầu đổi KCB', '2026-05-24 09:30:00'),
(3, 'Đang chờ Y tế duyệt', '2026-05-24 10:00:00'),
(4, 'Ổn định', '2026-05-24 10:30:00'),
(5, 'Cập nhật bệnh án', '2026-05-24 11:00:00'),
(6, 'Ổn định', '2026-05-24 11:30:00'),
(7, 'Điều trị ngoại trú', '2026-05-24 12:00:00'),
(8, 'Khỏe mạnh', '2026-05-24 12:30:00'),
(9, 'Khỏe mạnh', '2026-05-24 13:00:00'),
(10, 'Kiểm tra định kỳ', '2026-05-24 13:30:00'),
(11, 'Ổn định', '2026-05-24 14:00:00'),
(12, 'Khỏe mạnh', '2026-05-24 14:30:00'),
(13, 'Bệnh tuổi già, cần theo dõi', '2026-05-24 15:00:00'),
(14, 'Ổn định', '2026-05-24 15:30:00'),
(15, 'Điều trị thấp khớp', '2026-05-24 16:00:00'),
(16, 'Ổn định', '2026-05-24 16:30:00'),
(17, 'Khỏe mạnh', '2026-05-24 17:00:00'),
(18, 'Ổn định', '2026-05-24 17:30:00'),
(19, 'Bình thường', '2026-05-24 18:00:00'),
(20, 'Ổn định', '2026-05-24 18:30:00');

INSERT INTO household (household_id, household_code, head_citizen_id, ward_id, address_detail) VALUES
(1, 'HK-00001', 1, 'W26300', '12 Lê Lợi, Bến Nghé, Q1, TP.HCM'),
(2, 'HK-00002', 2, 'W26300', '45 Nguyễn Huệ, Bến Nghé, Q1, TP.HCM'),
(3, 'HK-00003', 3, 'W26303', '78 Lý Tự Trọng, Bến Thành, Q1, TP.HCM'),
(4, 'HK-00004', 4, 'W26800', '112 Quang Trung, Phường 1, Gò Vấp, TP.HCM'),
(5, 'HK-00005', 5, 'W00001', '205 Điện Biên, Điện Biên, Ba Đình, Hà Nội'),
(6, 'HK-00006', 6, 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu, Đà Nẵng'),
(7, 'HK-00007', 7, 'W26300', '12 Lê Lợi, Bến Nghé, Q1, TP.HCM'),
(8, 'HK-00008', 8, 'W26300', '33 Đồng Khởi, Bến Nghé, Q1, TP.HCM'),
(9, 'HK-00009', 9, 'W00001', '205 Điện Biên, Điện Biên, Ba Đình, Hà Nội'),
(10, 'HK-00010', 10, 'W26303', '78 Lý Tự Trọng, Bến Thành, Q1, TP.HCM'),
(11, 'HK-00011', 11, 'W26300', '45 Nguyễn Huệ, Bến Nghé, Q1, TP.HCM'),
(12, 'HK-00012', 12, 'W10001', '11 Hai Bà Trưng, Hòa Cường Bắc, Hải Châu, Đà Nẵng'),
(13, 'HK-00013', 13, 'W26303', '88 Mạc Đĩnh Chi, Bến Nghé, Q1, TP.HCM'),
(14, 'HK-00014', 14, 'W26303', '90 Thái Văn Lung, Bến Nghé, Q1, TP.HCM'),
(15, 'HK-00015', 15, 'W26303', '55 Thi Sách, Bến Nghé, Q1, TP.HCM'),
(16, 'HK-00016', 16, 'W10001', '104 Chu Mạnh Trinh, Bến Nghé, Q1, TP.HCM'),
(17, 'HK-00017', 17, 'W10001', '77 Lê Thánh Tôn, Bến Nghé, Q1, TP.HCM'),
(18, 'HK-00018', 18, 'W26300', '22 Tôn Thất Thiệp, Bến Nghé, Q1, TP.HCM'),
(19, 'HK-00019', 19, 'W26300', '14 Ngô Văn Năm, Bến Nghé, Q1, TP.HCM'),
(20, 'HK-00020', 20, 'W26800', '36 Lê Anh Xuân, Q1, TP.HCM');

INSERT INTO household_member (household_id, citizen_id, relation, joined_date) VALUES
(1, 1, 'Chủ hộ', '2010-01-01'),
(2, 2, 'Chủ hộ', '2005-06-15'),
(3, 3, 'Chủ hộ', '2015-08-20'),
(4, 4, 'Chủ hộ', '2018-09-02'),
(5, 5, 'Chủ hộ', '2012-10-10'),
(6, 6, 'Chủ hộ', '2020-05-05'),
(7, 7, 'Chủ hộ', '2015-01-01'),
(8, 8, 'Chủ hộ', '2019-03-01'),
(9, 9, 'Chủ hộ', '2021-02-15'),
(10, 10, 'Chủ hộ', '2016-04-10'),
(11, 11, 'Chủ hộ', '2012-07-01'),
(12, 12, 'Chủ hộ', '2022-09-12'),
(13, 13, 'Chủ hộ', '2015-07-27'),
(14, 14, 'Chủ hộ', '2021-01-01'),
(15, 15, 'Chủ hộ', '2010-04-30'),
(16, 16, 'Chủ hộ', '2013-05-19'),
(17, 17, 'Chủ hộ', '2008-12-22'),
(18, 18, 'Chủ hộ', '2014-06-01'),
(19, 19, 'Chủ hộ', '2011-08-20'),
(20, 20, 'Chủ hộ', '2022-02-28');

INSERT INTO living_condition (household_id, condition_type, description, assessment_date) VALUES
(1, 'Nhà cấp 4, thu nhập trung bình', 'Gia đình có thu nhập ổn định từ chăn nuôi và trợ cấp', '2026-05-01'),
(2, 'Cận nghèo, nhà vách tôn tạm bợ', 'Thu nhập bấp bênh, nhà ở có nguy cơ dột nát mùa mưa', '2026-05-02'),
(3, 'Nhà kiên cố, nước máy đầy đủ', 'Điều kiện sống đạt tiêu chuẩn đô thị hiện đại', '2026-05-03'),
(4, 'Hộ nghèo, thất nghiệp dài hạn', 'Thành viên lao động chính mất sức lao động, hoàn cảnh khó khăn', '2026-05-04'),
(5, 'Sống neo đơn, nhà tình nghĩa', 'Thương binh sống một mình, nhà do nhà nước xây tặng', '2026-05-05'),
(6, 'Mức sống khá giả, ổn định', 'Các thành viên đều có công ăn việc làm ổn định', '2026-05-06'),
(7, 'Bình thường', 'Thu nhập khá, nhà cửa ổn định', '2026-05-07'),
(8, 'Hộ nghèo', 'Được hỗ trợ chi phí sinh hoạt hàng tháng', '2026-05-08'),
(9, 'Nhà cấp 4', 'Đạt chuẩn sinh hoạt nông thôn', '2026-05-09'),
(10, 'Hộ nghèo', 'Được hỗ trợ chi phí điện nước định kỳ', '2026-05-10'),
(11, 'Khá giả', 'Mức sống cao hơn trung bình', '2026-05-11'),
(12, 'Bình thường', 'Ổn định kinh tế', '2026-05-12'),
(13, 'Nhà tình nghĩa', 'Nhà xây hỗ trợ chính sách Bà mẹ VNAH', '2026-05-13'),
(14, 'Hộ nghèo', 'Thiếu thốn tư liệu sản xuất, hoàn cảnh khó khăn', '2026-05-14'),
(15, 'Nhà kiên cố', 'Gia đình cách mạng tiêu biểu tại khu phố', '2026-05-15'),
(16, 'Khá giả', 'Sống trong khu chung cư tái định cư đạt chuẩn', '2026-05-16'),
(17, 'Bình thường', 'Có vườn cây ăn quả thu hoạch tốt', '2026-05-17'),
(18, 'Khá giả', 'Kinh doanh gia đình nhỏ có lãi', '2026-05-18'),
(19, 'Bình thường', 'Nhà cấp 4 kiên cố bê tông cốt thép', '2026-05-19'),
(20, 'Hộ nghèo', 'Thu nhập thời vụ bấp bênh, nhà tạm bợ', '2026-05-20');

INSERT INTO allowance_regime (regime_id, regime_name, base_amount, description) VALUES
(1, 'Trợ cấp thương binh (4,200,000 đ)', 4200000.00, 'Chi trả hàng tháng cho thương binh tỷ lệ 41% trở lên'),
(2, 'Trợ cấp tuất hàng tháng (2,100,000 đ)', 2100000.00, 'Trợ cấp tuất định kỳ cho vợ/chồng Liệt sĩ'),
(3, 'Trợ cấp hàng tháng (1,850,000 đ)', 1850000.00, 'Dành cho người hoạt động kháng chiến bị nhiễm chất độc hóa học'),
(4, 'Trợ cấp phụng dưỡng (3,600,000 đ)', 3600000.00, 'Hỗ trợ phụng dưỡng Bà mẹ Việt Nam Anh hùng định kỳ'),
(5, 'Trợ cấp bệnh binh (3,000,000 đ)', 3000000.00, 'Chi trả hàng tháng cho bệnh binh suy giảm lao động'),
(6, 'Trợ cấp hàng tháng (1,200,000 đ)', 1200000.00, 'Hỗ trợ cho con đẻ người hoạt động kháng chiến nhiễm CĐHH');

INSERT INTO citizen_allowance (citizen_id, regime_id, start_date, end_date, status) VALUES
(1, 1, '2010-01-01', NULL, 'active'),
(2, 2, '2005-06-15', NULL, 'active'),
(3, 3, '2015-08-20', NULL, 'active'), 
(4, 4, '2018-09-02', NULL, 'active'),
(5, 5, '2012-10-10', '2025-10-10', 'active'), 
(6, 6, '2020-05-05', NULL, 'active'),
(7, 1, '2015-01-01', NULL, 'active'),
(8, 6, '2019-03-01', NULL, 'active'),
(9, 2, '2021-02-15', NULL, 'active'),
(10, 3, '2016-04-10', NULL, 'active'),
(11, 1, '2012-07-01', NULL, 'active'),
(12, 6, '2022-09-12', NULL, 'active'),
(13, 1, '2015-07-27', NULL, 'active'),
(14, 6, '2021-01-01', NULL, 'active'),
(15, 3, '2010-04-30', NULL, 'active'),
(16, 5, '2013-05-19', NULL, 'active'),
(17, 2, '2008-12-22', NULL, 'active'),
(18, 1, '2014-06-01', NULL, 'active'),
(19, 3, '2011-08-20', NULL, 'active'),
(20, 6, '2022-02-28', NULL, 'active');

UPDATE object_mapping SET status = 'paused' WHERE citizen_id IN (3, 10, 15, 19);
UPDATE object_mapping SET status = 'expired' WHERE citizen_id IN (5, 9);

UPDATE citizen_allowance SET status = 'suspended' WHERE citizen_id IN (3, 10, 15, 19);
UPDATE citizen_allowance SET status = 'stopped' WHERE citizen_id IN (5, 9);

INSERT INTO campaign (campaign_id, campaign_name, year) VALUES
(1, 'Kỷ niệm 27/7', 2025),
(2, 'Tặng quà Tết 2026', 2026);

INSERT INTO gift_category (gift_category_id, category_name, unit) VALUES
(1, 'Tiền mặt trợ cấp Tết', 'VNĐ'),
(2, 'Xe lăn chuyên dụng', 'Chiếc'),
(3, 'Hộp quà nhu yếu phẩm', 'Hộp'),
(4, 'Tiền mặt trợ cấp', 'VNĐ'),
(5, 'Gạo', 'kg');

INSERT INTO agency (agency_id, agency_name, agency_type, level, parent_id) VALUES
(1, 'Sở Lao động - Thương binh và Xã hội', 'state_management', 1, NULL),
(2, 'UBND Quận 1', 'state_management', 2, 1),
(3, 'UBND Phường Bến Nghé', 'state_management', 3, 2),
(4, 'Trạm Y tế Phường Bến Nghé', 'medical_facility', 3, 2);

INSERT INTO official (official_id, agency_id, username, password_hash, role) VALUES
(1, 3, 'canbophuong', 'hash_pass_1', 'Cán bộ chính sách xã'),
(2, 2, 'canbophong', 'hash_pass_2', 'Chuyên viên phòng LĐTBXH'),
(3, 1, 'lanhdaoso', 'hash_pass_3', 'Lãnh đạo sở LĐTBXH'),
(4, 3, 'canbo_xa01', 'hash_pass_4', 'Cán bộ phường'),
(5, 4, 'canbo_yte01', 'hash_pass_5', 'Cán bộ y tế phường'),
(6, 1, 'quanly_so01', 'hash_pass_6', 'Quản lý cấp sở');

INSERT INTO visit_log (visit_log_id, campaign_id, citizen_id, gift_category_id, value, status, visited_at, officer_id) VALUES
(1, 1, 1, 1, 1000000.00, 'done', '2025-07-25 09:00:00', 1),
(2, 1, 13, 2, 3500000.00, 'done', '2025-07-26 10:00:00', 1),
(3, 2, 14, 1, 1500000.00, 'done', '2026-01-20 08:30:00', 4),
(4, 2, 15, 3, 500000.00, 'done', '2026-01-20 14:00:00', 4),
(5, 1, 16, 4, 1000000.00, 'pending', NULL, 1),
(6, 1, 17, 3, 500000.00, 'missed', NULL, 1),
(7, 2, 1, 5, 20.00, 'done', '2026-01-21 09:00:00', 4),
(8, 2, 2, 1, 1500000.00, 'done', '2026-01-21 10:00:00', 4),
(9, 2, 3, 3, 500000.00, 'done', '2026-01-21 11:00:00', 4),
(10, 2, 4, 1, 1500000.00, 'done', '2026-01-21 12:00:00', 4),
(11, 2, 5, 3, 500000.00, 'missed', NULL, 4),
(12, 2, 6, 1, 1500000.00, 'done', '2026-01-21 14:00:00', 4),
(13, 1, 2, 4, 1000000.00, 'done', '2025-07-27 09:00:00', 1),
(14, 1, 3, 4, 1000000.00, 'done', '2025-07-27 10:00:00', 1),
(15, 1, 4, 4, 1000000.00, 'done', '2025-07-27 11:00:00', 1),
(16, 1, 5, 4, 1000000.00, 'missed', NULL, 1),
(17, 1, 6, 4, 1000000.00, 'done', '2025-07-27 13:00:00', 1),
(18, 2, 7, 5, 10.00, 'done', '2026-01-22 09:00:00', 4),
(19, 2, 8, 3, 500000.00, 'done', '2026-01-22 10:00:00', 4),
(20, 2, 9, 1, 1500000.00, 'done', '2026-01-22 11:00:00', 4);

INSERT INTO dossier (dossier_id, citizen_id, status, dossier_type, created_at, submitted_at, reviewed_at, reviewed_by, note) VALUES
(1, 1, 'submitted', 'new_regime', '2026-05-01 08:00:00', '2026-05-01 08:30:00', NULL, NULL, 'Chờ duyệt hưởng chế độ Thương binh mới'),
(2, 2, 'approved', 'new_regime', '2026-05-02 09:00:00', '2026-05-02 09:30:00', '2026-05-03 10:00:00', 2, 'Hồ sơ đầy đủ, phê duyệt cấp lại Bằng Tổ quốc ghi công'),
(3, 3, 'rejected', 'new_regime', '2026-05-03 10:00:00', '2026-05-03 10:15:00', '2026-05-04 11:00:00', 2, 'Từ chối hỗ trợ cải thiện nhà ở do không thuộc diện ưu tiên đợt này'),
(4, 4, 'submitted', 'new_regime', '2026-05-04 11:00:00', '2026-05-04 11:20:00', NULL, NULL, 'Đề nghị giải quyết trợ cấp mai táng phí'),
(5, 5, 'approved', 'adjust_regime', '2026-05-05 14:00:00', '2026-05-05 14:30:00', '2026-05-06 16:00:00', 3, 'Đồng ý di chuyển hồ sơ đi tỉnh Lâm Đồng'),
(6, 6, 'draft', 'stop_regime', '2026-05-06 15:00:00', NULL, NULL, NULL, 'Đề nghị chấm dứt chế độ trợ cấp do đã đi làm có thu nhập ổn định'),
(7, 21, 'submitted', 'new_regime', '2026-05-07 09:00:00', '2026-05-07 09:30:00', NULL, NULL, 'Đề nghị hỗ trợ đi học nghề cho con người có công'),
(8, 8, 'approved', 'new_regime', '2026-05-08 10:00:00', '2026-05-08 10:30:00', '2026-05-09 11:00:00', 2, 'Hồ sơ đạt yêu cầu hỗ trợ học tập'),
(9, 9, 'submitted', 'adjust_regime', '2026-05-09 11:00:00', '2026-05-09 11:15:00', NULL, NULL, 'Yêu cầu thay đổi số tài khoản nhận trợ cấp'),
(10, 10, 'approved', 'new_regime', '2026-05-10 09:00:00', '2026-05-10 09:45:00', '2026-05-11 10:00:00', 2, 'Duyệt miễn giảm học phí phổ thông học kỳ mới'),
(11, 11, 'submitted', 'new_regime', '2026-05-11 14:00:00', '2026-05-11 14:30:00', NULL, NULL, 'Đề nghị nhận chế độ chăm sóc y tế tại nhà'),
(12, 12, 'draft', 'new_regime', '2026-05-12 15:00:00', NULL, NULL, NULL, 'Nháp hồ sơ xin điều dưỡng phục hồi sức khỏe định kỳ'),
(13, 13, 'submitted', 'new_regime', '2026-05-13 09:00:00', '2026-05-13 09:30:00', NULL, NULL, 'Hồ sơ xin cấp thẻ BHYT ưu đãi 100%'),
(14, 14, 'approved', 'adjust_regime', '2026-05-14 10:00:00', '2026-05-14 10:20:00', '2026-05-15 14:00:00', 3, 'Điều chỉnh tăng mức trợ cấp theo Nghị định mới'),
(15, 15, 'rejected', 'new_regime', '2026-05-15 11:00:00', '2026-05-15 11:30:00', '2026-05-16 16:00:00', 2, 'Thiếu chứng nhận thương tật gốc, yêu cầu nộp lại'),
(16, 16, 'submitted', 'new_regime', '2026-05-16 09:00:00', '2026-05-16 09:30:00', NULL, NULL, 'Đề nghị xét duyệt thương binh bổ sung'),
(17, 17, 'approved', 'new_regime', '2026-05-17 10:00:00', '2026-05-17 10:15:00', '2026-05-18 11:00:00', 2, 'Phê duyệt ưu đãi vay vốn sản xuất nông nghiệp'),
(18, 18, 'submitted', 'adjust_regime', '2026-05-18 14:00:00', '2026-05-18 14:30:00', NULL, NULL, 'Yêu cầu chuyển đổi phương thức nhận quà tặng tri ân'),
(19, 19, 'draft', 'new_regime', '2026-05-19 15:00:00', NULL, NULL, NULL, 'Bản nháp hồ sơ xin sửa chữa cải tạo mộ liệt sĩ gia tộc'),
(20, 20, 'submitted', 'stop_regime', '2026-05-20 09:00:00', '2026-05-20 09:30:00', NULL, NULL, 'Khai báo tự nguyện dừng trợ cấp do thay đổi hộ khẩu');

INSERT INTO attachment (dossier_id, file_name, file_url) VALUES
(1, 'don_de_nghi_tb.pdf', 'http://chinhsach.gov.vn/files/don_de_nghi_tb.pdf'),
(2, 'giay_chung_nhan_ls.pdf', 'http://chinhsach.gov.vn/files/giay_chung_nhan_ls.pdf'),
(3, 'hoa_don_sua_nha.pdf', 'http://chinhsach.gov.vn/files/hoa_don_sua_nha.pdf'),
(4, 'giay_chung_tu.pdf', 'http://chinhsach.gov.vn/files/giay_chung_tu.pdf'),
(5, 'don_xin_di_chuyen.pdf', 'http://chinhsach.gov.vn/files/don_xin_di_chuyen.pdf'),
(7, 'chung_chi_hoc_nghe.pdf', 'http://chinhsach.gov.vn/files/chung_chi_hoc_nghe.pdf'),
(8, 'don_xin_hoc_bong.pdf', 'http://chinhsach.gov.vn/files/don_xin_hoc_bong.pdf'),
(9, 'so_tk_xac_minh.pdf', 'http://chinhsach.gov.vn/files/so_tk_xac_minh.pdf'),
(10, 'don_mien_giam_hp.pdf', 'http://chinhsach.gov.vn/files/don_mien_giam_hp.pdf'),
(13, 'giay_khai_sinh.pdf', 'http://chinhsach.gov.vn/files/giay_khai_sinh.pdf'),
(14, 'quyet_dinh_tang_muc.pdf', 'http://chinhsach.gov.vn/files/quyet_dinh_tang_muc.pdf'),
(17, 'phuong_an_vay_von.pdf', 'http://chinhsach.gov.vn/files/phuong_an_vay_von.pdf');

INSERT INTO dossier_transfer (dossier_id, from_agency, to_agency, transfer_date) VALUES
(2, 3, 2, '2026-05-02'),
(3, 3, 2, '2026-05-03'),
(5, 2, 1, '2026-05-05'),
(8, 3, 2, '2026-05-08'),
(10, 3, 2, '2026-05-10'),
(14, 2, 1, '2026-05-14'),
(17, 3, 2, '2026-05-17');

INSERT INTO authorization (authorization_id, policy_holder_id, proxy_id, relation, document_url, start_date, end_date, status) VALUES
(1, 1, 7, 'Con ruột', 'http://chinhsach.gov.vn/auth/giay_uq_1.pdf', '2025-01-01', '2027-01-01', 'active'),
(2, 23, 8, 'Cháu ngoại', 'http://chinhsach.gov.vn/auth/giay_uq_2.pdf', '2024-06-15', '2026-06-15', 'active'),
(3, 5, 9, 'Con ruột', 'http://chinhsach.gov.vn/auth/giay_uq_3.pdf', '2023-10-10', '2025-10-10', 'expired'),
(4, 3, 10, 'Em trai', 'http://chinhsach.gov.vn/auth/giay_uq_4.pdf', '2026-02-20', '2028-02-20', 'active'),
(5, 2, 11, 'Chồng', 'http://chinhsach.gov.vn/auth/giay_uq_5.pdf', '2022-05-05', '2024-05-05', 'revoked'),
(6, 6, 12, 'Chị gái', 'http://chinhsach.gov.vn/auth/giay_uq_6.pdf', '2026-04-12', '2029-04-12', 'active'),
(7, 13, 8, 'Con trai', 'http://chinhsach.gov.vn/auth/giay_uq_7.pdf', '2025-05-01', '2027-05-01', 'active'),
(8, 14, 10, 'Con trai', 'http://chinhsach.gov.vn/auth/giay_uq_8.pdf', '2025-06-01', '2027-06-01', 'active'),
(9, 15, 12, 'Con gái', 'http://chinhsach.gov.vn/auth/giay_uq_9.pdf', '2024-08-01', '2026-08-01', 'active'),
(10, 16, 7, 'Con trai', 'http://chinhsach.gov.vn/auth/giay_uq_10.pdf', '2025-09-01', '2027-09-01', 'active'),
(11, 17, 11, 'Con trai', 'http://chinhsach.gov.vn/auth/giay_uq_11.pdf', '2024-10-01', '2026-10-01', 'expired'),
(12, 18, 9, 'Vợ', 'http://chinhsach.gov.vn/auth/giay_uq_12.pdf', '2025-11-01', '2027-11-01', 'active'),
(13, 19, 8, 'Con trai', 'http://chinhsach.gov.vn/auth/giay_uq_13.pdf', '2024-12-01', '2026-12-01', 'revoked'),
(14, 20, 10, 'Con trai', 'http://chinhsach.gov.vn/auth/giay_uq_14.pdf', '2025-01-01', '2027-01-01', 'active'),
(15, 21, 12, 'Con gái', 'http://chinhsach.gov.vn/auth/giay_uq_15.pdf', '2024-03-01', '2026-03-01', 'active'),
(16, 22, 7, 'Con trai', 'http://chinhsach.gov.vn/auth/giay_uq_16.pdf', '2025-04-01', '2027-04-01', 'active'),
(17, 1, 8, 'Em ruột', 'http://chinhsach.gov.vn/auth/giay_uq_17.pdf', '2023-05-01', '2025-05-01', 'expired'),
(18, 2, 9, 'Con gái', 'http://chinhsach.gov.vn/auth/giay_uq_18.pdf', '2025-06-01', '2027-06-01', 'active'),
(19, 3, 11, 'Vợ', 'http://chinhsach.gov.vn/auth/giay_uq_19.pdf', '2024-07-01', '2026-07-01', 'revoked'),
(20, 4, 12, 'Con gái', 'http://chinhsach.gov.vn/auth/giay_uq_20.pdf', '2025-08-01', '2027-08-01', 'active');

INSERT INTO feedback_ticket (feedback_ticket_id, citizen_id, title, content, reply, status, created_at, resolved_by, resolved_at) VALUES
(1, 18, 'Hỏi về việc chậm nhận thẻ bảo hiểm y tế năm mới', 'Tôi thuộc diện gia đình có công nhưng đến nay vẫn chưa được phát thẻ BHYT gia hạn năm 2026', 'Đã cấp bổ sung thẻ mới vào ngày 15/01/2026 do lỗi dữ liệu in ấn.', 'resolved', '2026-01-10 08:00:00', 1, '2026-01-15 10:00:00'),
(2, 14, 'Kiến nghị kiểm tra lại điều kiện kinh tế hộ nghèo', 'Gia đình gặp thiên tai làm đổ sập chuồng trại, kính mong phường xuống thẩm định lại hoàn cảnh để được trợ cấp bổ sung.', NULL, 'in_progress', '2026-05-22 09:00:00', NULL, NULL),
(3, 19, 'Cảm ơn chính sách hỗ trợ kịp thời cho gia đình', 'Đại diện gia đình gửi lời cảm ơn sâu sắc tới các cán bộ đã hỗ trợ sửa nhà trước mùa mưa bão.', 'Ủy ban nhân dân phường rất trân trọng những đóng góp của gia đình với tổ quốc.', 'closed', '2025-10-15 14:00:00', 1, '2025-10-16 16:00:00'),
(4, 20, 'Đăng ký chuyển sang nhận trợ cấp qua thẻ ATM', 'Tôi muốn đổi phương thức nhận trợ cấp tuất từ nhận tiền mặt tại bưu điện sang thẻ Vietcombank', 'Đã cập nhật thông tin số tài khoản của công dân vào danh sách chi trả tự động hàng tháng.', 'closed', '2026-04-15 10:00:00', 2, '2026-04-18 11:00:00'),
(5, 21, 'Sai sót thông tin ngày sinh trên hệ thống', 'Ngày sinh của tôi trên cổng dịch vụ công hiển thị 12/12/1950 nhưng đúng trong CCCD là 15/12/1950.', NULL, 'open', '2026-05-20 15:00:00', NULL, NULL),
(6, 22, 'Xin hướng dẫn thủ tục cấp lại Bằng Tổ quốc ghi công', 'Bằng gốc của gia đình bị mối mọt, xin hỏi cần làm đơn gửi lên cơ quan nào?', NULL, 'open', '2026-05-23 16:30:00', NULL, NULL),
(7, 1, 'Hỏi về chế độ ưu tiên đi học cho con thương binh', 'Con tôi muốn thi đại học thì được cộng bao nhiêu điểm chính sách?', 'Được cộng 1 đến 2 điểm tùy nhóm ưu tiên theo quy chế tuyển sinh quốc gia.', 'resolved', '2026-02-01 09:00:00', 1, '2026-02-05 10:00:00'),
(8, 2, 'Yêu cầu kiểm tra tiến trình cấp Bằng Tổ quốc ghi công', 'Tôi nộp hồ sơ xin cấp lại bằng từ tháng 1 đến nay chưa thấy có phản hồi', 'Bằng gốc đang được in ấn phôi tại Bộ, dự kiến phát trong tháng 6.', 'resolved', '2026-03-01 10:00:00', 2, '2026-03-05 11:00:00'),
(9, 3, 'Hỏi về việc tạm dừng chi trả trợ cấp tháng 5', 'Tháng này tôi chưa nhận được tiền trợ cấp chất độc hóa học vào thẻ ngân hàng', 'Do hồ sơ đang trong diện rà soát điều kiện cư trú thực tế.', 'resolved', '2026-05-12 09:00:00', 1, '2026-05-14 10:00:00'),
(10, 4, 'Kiến nghị hỗ trợ điều dưỡng phục hồi sức khỏe', 'Mẹ tôi tuổi đã cao, muốn đăng ký đi nghỉ dưỡng đợt hè này', NULL, 'in_progress', '2026-05-13 14:00:00', NULL, NULL),
(11, 5, 'Kiến nghị cấp xe lăn mới', 'Xe cũ được cấp cách đây 5 năm đã hỏng khung sắt', 'Ủy ban đã phê duyệt và đưa vào danh sách cấp phát hiện vật trong ngày 27/7 tới.', 'resolved', '2026-04-10 11:00:00', 1, '2026-04-15 15:00:00'),
(12, 6, 'Hỏi về mức học phí được miễn giảm cho con đẻ CĐHH', 'Con tôi học trường công lập cấp 3 có được miễn học phí hoàn toàn không?', 'Được miễn 100% học phí theo quy định hiện hành đối với con đẻ người nhiễm CĐHH.', 'resolved', '2026-01-20 09:00:00', 1, '2026-01-22 10:00:00'),
(13, 7, 'Kiến nghị hỗ trợ vay vốn ưu đãi sửa nhà', 'Gia đình muốn sửa sang lại tường rào bị sập do triều cường dâng cao', NULL, 'open', '2026-05-24 08:00:00', NULL, NULL),
(14, 8, 'Hỏi về ngày chi trả trợ cấp hàng tháng cố định', 'Thời gian chi trả cố định hàng tháng vào ngày bao nhiêu dương lịch?', 'Chi trả từ ngày 10 đến ngày 15 hàng tháng tùy lịch làm việc của kho bạc quận.', 'resolved', '2026-02-15 09:00:00', 2, '2026-02-18 10:00:00'),
(15, 9, 'Kiến nghị thay đổi địa điểm họp mặt ngày 27/7', 'Kính mong phường tổ chức tại nhà văn hóa thay vì văn phòng ủy ban vì chật hẹp', NULL, 'in_progress', '2026-05-24 09:00:00', NULL, NULL),
(16, 10, 'Hỏi về chế độ tang lễ phí của người có công', 'Người có công qua đời được nhà nước hỗ trợ bao nhiêu chi phí mai táng?', 'Mức hỗ trợ mai táng phí bằng 10 lần mức lương cơ sở tại thời điểm từ trần.', 'resolved', '2026-03-10 09:00:00', 1, '2026-03-12 10:00:00'),
(17, 11, 'Sai sót thông tin ngân hàng nhận chi trả trợ cấp', 'Hệ thống tự nhận sai số tài khoản Vietcombank của tôi', 'Đã thực hiện cập nhật lại đúng thông tin tài khoản được cung cấp.', 'resolved', '2026-04-05 09:00:00', 2, '2026-04-08 10:00:00'),
(18, 12, 'Kiến nghị hỗ trợ chi phí thuốc men đặc trị', 'Thành viên có bệnh hiểm nghèo cần hỗ trợ thêm ngoài danh mục bảo hiểm y tế chi trả', NULL, 'open', '2026-05-24 10:00:00', NULL, NULL),
(19, 13, 'Hỏi về thủ tục hồ sơ di chuyển đi tỉnh khác', 'Tôi chuẩn bị dọn về quê sinh sống, cần rút hồ sơ mang đi như thế nào?', 'Vui lòng làm đơn xin di chuyển theo mẫu số 06 gửi trực tiếp tại UBND phường.', 'resolved', '2026-02-20 09:00:00', 1, '2026-02-22 10:00:00'),
(20, 15, 'Kiến nghị kiểm tra thái độ phục vụ của cán bộ tiếp dân', 'Cán bộ trả lời cộc lốc khi tôi đến hỏi thủ tục xin sửa mộ liệt sĩ', 'Đã tiến hành nhắc nhở, kiểm điểm cán bộ tiếp dân trong buổi họp giao ban cơ quan.', 'resolved', '2026-03-15 14:00:00', 3, '2026-03-18 16:00:00');

INSERT INTO payment_history (payment_id, citizen_id, regime_id, amount, payment_date, account_number, bank_name, status, payment_note) VALUES
(1, 1, 1, 4200000.00, '2026-05-10', '1000***001', 'Vietcombank', 'success', 'Thành công'),
(2, 2, 2, 2100000.00, '2026-05-10', '2000***002', 'BIDV', 'success', 'Thành công'),
(3, 3, 3, 1850000.00, '2026-05-10', '3000***003', 'VietinBank', 'failed', 'Lỗi (Sai STK)'),
(4, 4, 4, 3600000.00, '2026-05-10', '1000***004', 'Vietcombank', 'success', 'Thành công'),
(5, 5, 5, 500000.00, '2026-05-10', '4000***005', 'Agribank', 'success', 'Thành công (Chi trả bổ sung truy lĩnh)'),
(6, 6, 6, 1200000.00, '2026-05-10', '2000***006', 'BIDV', 'failed', 'Lỗi (Khóa thẻ)'),
(7, 7, 1, 4200000.00, '2026-05-10', '1000***007', 'Vietcombank', 'success', 'Thành công'),
(8, 8, 6, 1200000.00, '2026-05-10', '2000***008', 'BIDV', 'success', 'Thành công'),
(9, 9, 2, 2100000.00, '2026-05-10', '4000***009', 'Agribank', 'success', 'Thành công'),
(10, 10, 3, 1850000.00, '2026-05-10', '3000***010', 'VietinBank', 'failed', 'Thành công (Tạm treo thanh toán do paused)'),
(11, 11, 1, 4200000.00, '2026-05-10', '1000***011', 'Vietcombank', 'success', 'Thành công'),
(12, 12, 6, 1200000.00, '2026-05-10', '2000***012', 'BIDV', 'success', 'Thành công'),
(13, 13, 1, 4200000.00, '2026-05-10', '3000***013', 'VietinBank', 'success', 'Thành công'),
(14, 14, 6, 1200000.00, '2026-05-10', '1000***014', 'Vietcombank', 'success', 'Thành công'),
(15, 15, 3, 1850000.00, '2026-05-10', '2000***015', 'BIDV', 'failed', 'Thành công (Tạm đình chỉ chi trả)'),
(16, 16, 5, 3000000.00, '2026-05-10', '4000***016', 'Agribank', 'success', 'Thành công'),
(17, 17, 2, 2100000.00, '2026-05-10', '2000***017', 'BIDV', 'success', 'Thành công'),
(18, 18, 1, 4200000.00, '2026-05-10', '1000***018', 'Vietcombank', 'success', 'Thành công'),
(19, 19, 3, 1850000.00, '2026-05-10', '3000***019', 'VietinBank', 'failed', 'Thành công (Tạm đình chỉ chi trả)'),
(20, 20, 6, 1200000.00, '2026-05-10', '1000***020', 'Vietcombank', 'success', 'Thành công');

INSERT INTO audit_log (audit_log_id, official_id, action, table_name, record_id, old_data, new_data, ip_address, created_at) VALUES
(1, 1, 'UPDATE', 'dossier', 1, '{"status": "submitted"}', '{"status": "approved"}', '192.168.1.15', '2026-05-24 14:30:00'),
(2, 2, 'INSERT', 'feedback_ticket', 2, 'null', '{"title": "Kiến nghị kiểm tra lại điều kiện kinh tế hộ nghèo"}', '192.168.2.34', '2026-05-24 10:15:00'),
(3, 3, 'UPDATE', 'official', 3, '{"role": "staff"}', '{"role": "manager"}', '10.0.0.5', '2026-05-23 16:45:00'),
(4, 1, 'DELETE', 'authorization', 5, '{"authorization_id": 5, "status": "active"}', 'null', '192.168.1.15', '2026-05-23 09:20:00'),
(5, 2, 'UPDATE', 'citizen_allowance', 1, '{"status": "active"}', '{"status": "suspended"}', '192.168.2.34', '2026-05-22 15:10:00'),
(6, NULL, 'INSERT', 'payment_history', 6, 'null', '{"payment_id": 6, "status": "failed"}', 'localhost', '2026-05-22 08:05:00'),
(7, 1, 'INSERT', 'dossier', 7, 'null', '{"dossier_id": 7}', '192.168.1.15', '2026-05-21 09:00:00'),
(8, 2, 'UPDATE', 'dossier', 8, '{"status": "submitted"}', '{"status": "approved"}', '192.168.2.34', '2026-05-21 10:00:00'),
(9, 1, 'INSERT', 'feedback_ticket', 13, 'null', '{"feedback_ticket_id": 13}', '192.168.1.15', '2026-05-21 11:00:00'),
(10, 4, 'UPDATE', 'household_member', 1, '{"relation": "Con"}', '{"relation": "Con ruột"}', '192.168.1.20', '2026-05-21 14:00:00'),
(11, 4, 'UPDATE', 'living_condition', 4, '{"condition_type": "Nghèo"}', '{"condition_type": "Hộ nghèo"}', '192.168.1.20', '2026-05-21 15:00:00'),
(12, 2, 'UPDATE', 'citizen_allowance', 12, '{"status": "active"}', '{"status": "stopped"}', '192.168.2.34', '2026-05-20 09:00:00'),
(13, 2, 'INSERT', 'dossier_transfer', 4, 'null', '{"dossier_transfer_id": 4}', '192.168.2.34', '2026-05-20 10:00:00'),
(14, 1, 'UPDATE', 'authorization', 17, '{"status": "active"}', '{"status": "expired"}', '192.168.1.15', '2026-05-20 11:00:00'),
(15, 1, 'INSERT', 'medical_snapshot', 20, 'null', '{"medical_snapshot_id": 20}', '192.168.1.15', '2026-05-19 14:00:00'),
(16, 2, 'UPDATE', 'official', 5, '{"role": "staff"}', '{"role": "admin"}', '192.168.2.34', '2026-05-19 15:00:00'),
(17, 3, 'UPDATE', 'agency', 3, '{"agency_name": "Phường"}', '{"agency_name": "UBND Phường Bến Nghé"}', '10.0.0.5', '2026-05-19 16:00:00'),
(18, 1, 'INSERT', 'visit_log', 20, 'null', '{"visit_log_id": 20}', '192.168.1.15', '2026-05-18 09:00:00'),
(19, 2, 'UPDATE', 'feedback_ticket', 17, '{"status": "open"}', '{"status": "resolved"}', '192.168.2.34', '2026-05-18 10:00:00'),
(20, 1, 'DELETE', 'attachment', 12, '{"file_name": "old.pdf"}', 'null', '192.168.1.15', '2026-05-18 11:00:00');

SELECT 'DỮ LIỆU MẪU ĐÃ ĐƯỢC CHÈN THÀNH CÔNG VỚI HƠN 20 BẢN GHI CHO TẤT CẢ CÁC BẢNG QUAN HỆ!' AS Message;