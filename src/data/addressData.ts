export type Ward = { id: string; name: string };
export type District = { id: string; name: string; wards: Ward[] };
export type Province = { id: string; name: string; districts: District[] };

export const provincesData: Province[] = [
  {
    id: 'p1',
    name: 'Hà Nội',
    districts: [
      {
        id: 'd1',
        name: 'Quận Cầu Giấy',
        wards: [
          { id: 'w1', name: 'Phường Dịch Vọng' },
          { id: 'w2', name: 'Phường Mai Dịch' },
          { id: 'w3', name: 'Phường Dịch Vọng Hậu' },
          { id: 'w4', name: 'Phường Nghĩa Đô' },
        ],
      },
      {
        id: 'd2',
        name: 'Quận Đống Đa',
        wards: [
          { id: 'w5', name: 'Phường Láng Hạ' },
          { id: 'w6', name: 'Phường Ô Chợ Dừa' },
          { id: 'w7', name: 'Phường Khâm Thiên' },
          { id: 'w8', name: 'Phường Trung Phụng' },
        ],
      },
      {
        id: 'd3',
        name: 'Quận Hoàn Kiếm',
        wards: [
          { id: 'w9', name: 'Phường Hàng Bài' },
          { id: 'w10', name: 'Phường Hàng Trống' },
          { id: 'w11', name: 'Phường Phan Chu Trinh' },
        ],
      },
      {
        id: 'd4',
        name: 'Quận Ba Đình',
        wards: [
          { id: 'w12', name: 'Phường Cống Vị' },
          { id: 'w13', name: 'Phường Ngọc Hà' },
          { id: 'w14', name: 'Phường Kim Mã' },
        ],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Hồ Chí Minh',
    districts: [
      {
        id: 'd5',
        name: 'Quận 1',
        wards: [
          { id: 'w15', name: 'Phường Bến Nghé' },
          { id: 'w16', name: 'Phường Đa Kao' },
          { id: 'w17', name: 'Phường Bến Thành' },
        ],
      },
      {
        id: 'd6',
        name: 'Quận 3',
        wards: [
          { id: 'w18', name: 'Phường Võ Thị Sáu' },
          { id: 'w19', name: 'Phường 1' },
          { id: 'w20', name: 'Phường 2' },
        ],
      },
      {
        id: 'd7',
        name: 'Quận 7',
        wards: [
          { id: 'w21', name: 'Phường Tân Phú' },
          { id: 'w22', name: 'Phường Tân Thuận Đông' },
          { id: 'w23', name: 'Phường Phú Mỹ' },
        ],
      },
      {
        id: 'd8',
        name: 'Thành phố Thủ Đức',
        wards: [
          { id: 'w24', name: 'Phường Hiệp Bình Chánh' },
          { id: 'w25', name: 'Phường Linh Trung' },
          { id: 'w26', name: 'Phường Tam Bình' },
        ],
      },
    ],
  },
  {
    id: 'p3',
    name: 'Đà Nẵng',
    districts: [
      {
        id: 'd9',
        name: 'Quận Hải Châu',
        wards: [
          { id: 'w27', name: 'Phường Thanh Bình' },
          { id: 'w28', name: 'Phường Thuận Phước' },
          { id: 'w29', name: 'Phường Hải Châu I' },
        ],
      },
      {
        id: 'd10',
        name: 'Quận Sơn Trà',
        wards: [
          { id: 'w30', name: 'Phường An Hải Bắc' },
          { id: 'w31', name: 'Phường Mân Thái' },
        ],
      },
    ],
  },
];
