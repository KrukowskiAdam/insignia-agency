# 🚀 Workflow dla strony INSIGNIA

## Faza 1: Frontend Development (2-3 tygodnie)

### Tydzień 1: Sekcje + Layout
- [ ] Hero z parallax scrollem
- [ ] O nas + animacje fade-in
- [ ] Services grid z hover effects
- [ ] Portfolio gallery z transitions
- [ ] Testimonials slider
- [ ] Contact form

### Tydzień 2: Animacje + Scroll Effects
- [ ] Svelte transitions na wszystkich sekcjach
- [ ] Intersection Observer dla scroll animations
- [ ] Smooth scroll między sekcjami
- [ ] Parallax effects
- [ ] Micro-interactions (buttons, cards)

### Tydzień 3: Polish
- [ ] Responsywność
- [ ] Performance optimization
- [ ] Loading states
- [ ] Error handling

---

## Faza 2: Strapi Integration (1 tydzień)

### Content Types do stworzenia:

#### 1. **Homepage Settings** (Single Type)
```json
{
  "heroTitle": "text",
  "heroSubtitle": "text",
  "heroCTA": "text",
  "heroImage": "media"
}
```

#### 2. **Service** (Collection)
```json
{
  "title": "text",
  "description": "richtext",
  "icon": "text",
  "order": "number"
}
```

#### 3. **Project** (Collection)
```json
{
  "title": "text",
  "description": "richtext",
  "category": "text",
  "images": "media (multiple)",
  "client": "text",
  "year": "number",
  "featured": "boolean"
}
```

#### 4. **Team Member** (Collection)
```json
{
  "name": "text",
  "position": "text",
  "bio": "richtext",
  "photo": "media",
  "linkedin": "text"
}
```

#### 5. **Testimonial** (Collection)
```json
{
  "author": "text",
  "company": "text",
  "text": "richtext",
  "rating": "number",
  "avatar": "media"
}
```

---

## Faza 3: Połączenie (3-4 dni)

### Tasks:
- [ ] Stwórz utility function dla Strapi API
- [ ] Zastąp hardcoded data w każdej sekcji
- [ ] Dodaj loading states
- [ ] Test z różnymi ilościami contentu
- [ ] Strapi permissions (public read)

---

## 🎯 Korzyści tego podejścia:

✅ **Szybki start** - pracujesz od razu nad UI/UX
✅ **Elastyczność** - zmiany w designie bez ruszania backendu
✅ **Prezentacja klientowi** - pokazujesz efekty wizualne szybko
✅ **Lepsza struktura danych** - wiesz czego dokładnie potrzebujesz
✅ **Animacje niezależne** - działają bez względu na źródło danych

---

## 📦 Przydatne biblioteki dla animacji:

```bash
# Frontend animations
npm install @sveltejs/motion
npm install svelte-inview
npm install svelte-parallax
```

---

## 🔄 Migration pattern:

```javascript
// PRZED (hardcoded)
<Hero 
  title="Agencja Marketingowa"
  subtitle="Tworzymy marki"
/>

// PO (z Strapi)
<Hero {...data.hero} />
```

Animacje w komponencie **NIE ZMIENIAJĄ SIĘ** - tylko props!
