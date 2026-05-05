# API Endpoint & Data Handling Standard

Mô tả: Quy trình bắt buộc khi thêm mới hoặc cập nhật một API endpoint trong hệ thống, đảm bảo tính nhất quán giữa các tầng kiến trúc (Infrastructure, Application, Presentation) và hiệu suất xử lý dữ liệu.

## Nguyên tắc cốt lõi

1. **Mandatory TanStack Query:** Tất cả các thao tác lấy dữ liệu (query) hoặc thay đổi dữ liệu (mutation) từ phía client đều phải thông qua TanStack Query. Không gọi trực tiếp API trong component hoặc `useEffect`.
2. **Type-Safe Data:** Mọi dữ liệu vào/ra từ API đều phải được định nghĩa kiểu dữ liệu rõ ràng bằng TypeScript (Interfaces/Types).
3. **Layer Separation:**
   - **Infrastructure:** Nơi chứa logic gọi API thuần túy và định nghĩa DTO (Data Transfer Object).
   - **Application (Optional but recommended):** Chứa Use Case để xử lý business logic, mapping dữ liệu trước khi trả về Presentation.
   - **Presentation (Hooks):** Chứa custom hooks bọc TanStack Query.

---

## Quy trình triển khai (4 bước)

### Bước 1: Định nghĩa Type & API Function (Infrastructure)
Viết tại thư mục `infrastructure` của feature.

```typescript
// features/your-feature/infrastructure/your-api.api.ts
export interface YourDataDTO {
  id: string;
  name: string;
  // ... các trường khác
}

export const yourApi = {
  getData: async (params: QueryParams): Promise<YourDataDTO[]> => {
    const response = await axiosInstance.get('/your-endpoint', { params });
    return response.data;
  },
  createData: async (data: CreateDTO): Promise<YourDataDTO> => {
    const response = await axiosInstance.post('/your-endpoint', data);
    return response.data;
  }
};
```

### Bước 2: Viết Use Case (Application)
Kết nối Infrastructure với Application logic.

```typescript
// features/your-feature/application/get-data.use-case.ts
import { yourApi, YourDataDTO } from "../infrastructure/your-api.api";

export class GetDataUseCase {
  async execute(params: any): Promise<YourDataDTO[]> {
    // Logic xử lý thêm (mapping, filtering, v.v.)
    return await yourApi.getData(params);
  }
}
export const getDataUseCase = new GetDataUseCase();
```

### Bước 3: Đăng ký Query Keys (Global)
Cập nhật bộ khóa tại `@/lib/query-keys.ts` để quản lý cache hiệu quả.

```typescript
// lib/query-keys.ts
export const queryKeys = {
  yourFeature: {
    all: ['yourFeature'] as const,
    list: (params: any) => [...queryKeys.yourFeature.all, 'list', params] as const,
    details: (id: string) => [...queryKeys.yourFeature.all, 'details', id] as const,
  },
};
```

### Bước 4: Viết Custom Hook (Presentation)
Cung cấp dữ liệu cho UI thông qua TanStack Query.

```typescript
// features/your-feature/presentation/hooks/use-your-data.ts
import { useQuery } from "@tanstack/react-query";
import { getDataUseCase } from "../../application/get-data.use-case";
import { queryKeys } from "@/lib/query-keys";

export const useYourData = (params: any) => {
  return useQuery({
    queryKey: queryKeys.yourFeature.list(params),
    queryFn: () => getDataUseCase.execute(params),
    // Thêm các options như staleTime, cacheTime nếu cần
  });
};
```

---

## Checklist Kiểm tra
- [ ] Dữ liệu API đã có interface/type tương ứng chưa?
- [ ] Hàm gọi API có nằm trong tầng `infrastructure` không?
- [ ] Đã sử dụng `useQuery` hoặc `useMutation` chưa?
- [ ] Query Key có được định nghĩa tập trung trong `queryKeys` không?
- [ ] Custom hook có xử lý các trạng thái `isLoading`, `isError`, `data` một cách sạch sẽ không?
