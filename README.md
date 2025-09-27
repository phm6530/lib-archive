# Notion 기반 아카이브

## 🚀 주요 기능
1. **Notion 기반 CMS**
   - Notion 관계형 테이블을 활용하여 게시판형 아카이브 구성
   - 데이터베이스 설계 과정 없이 빠른 구축 가능
   - CRUD + 확장성 보장

2. **GitHub API + Sandbox Demo**
   - Repository 컬럼 기반으로 README를 불러와 일정한 스타일로 출력
   - Sandbox Demo를 브라우저에서 바로 확인 가능

3. **Next.js 캐싱 설계**
   - Notion API 호출 제한(시간당 60회)을 **Full Route Cache + Revalidate Tags**로 해결
   - 관리자(Auth.js 인증)만 갱신 버튼을 통해 페이지 업데이트 가능

---

## 🛠 아키텍처
- **DB**: Notion Table  
- **Frontend**: Next.js (Full Route Cache + Revalidate Tags)  
- **Auth**: Auth.js + 커스텀 Blog API (관리자 계정 활용)  
- **UI**: Shadcn-ui + Tailwind v4  

---

## ✨ 차별점
- Notion DB를 CMS처럼 변환 → 빠른 구축과 운영 가능  
- GitHub API + Sandbox Demo 제공 → 단순 아카이브를 넘어 실사용에 가까운 체험 제공  
- 관리자 전용 갱신 기능 → 운영 편의성과 안정성 확보  
- Full Route Cache 설계를 통한 **높은 Web Vitals 성능 지표** 달성  

---
