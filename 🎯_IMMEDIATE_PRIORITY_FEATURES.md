# 🎯 CÁC TÍNH NĂNG ƯU TIÊN CAO NHẤT

## ⚡ TOP 10 FEATURES CẦN LÀM NGAY

### 1. 🚨 BLOCK & REPORT USER (CRITICAL)
**Tại sao:** User safety là #1 priority  
**Time:** 1 tuần  
**APIs cần:**
```
POST   /api/dating/block/:userId
DELETE /api/dating/unblock/:userId
GET    /api/dating/blocked-users
POST   /api/dating/report/:userId
```

**Database:**
```sql
CREATE TABLE blocked_users (
  id, blocker_id, blocked_id, reason, created_at
);

CREATE TABLE reports (
  id, reporter_id, reported_id, reason, 
  description, status, created_at
);
```

---

### 2. 📸 PHOTO VERIFICATION (CRITICAL)
**Tại sao:** Fake profiles là vấn đề lớn  
**Time:** 1.5 tuần  
**Flow:**
```
User uploads selfie in specific pose
→ AI compares with profile photos
→ Admin reviews
→ Blue checkmark if verified
```

**APIs:**
```
POST /api/dating/verification/start
POST /api/dating/verification/upload
GET  /api/dating/verification/status
```

---

### 3. 💎 UNLIMITED SWIPES (PREMIUM)
**Tại sao:** Monetization  
**Time:** 3 ngày  
**Logic:**
- Free users: 50 swipes/day
- Premium users: Unlimited
- Reset daily at midnight

**Implementation:**
```typescript
// Add to SwipeProfileUseCase
const swipeCount = await getSwipeCountToday(customerId);
const profile = await getProfile(customerId);

if (!profile.isPremium && swipeCount >= 50) {
  throw new Error('Daily swipe limit reached. Upgrade to Premium!');
}
```

---

### 4. ↩️ REWIND/UNDO SWIPE (PREMIUM)
**Tại sao:** Top requested feature  
**Time:** 2 ngày  
**API:**
```
POST /api/dating/swipe/undo
```

**Logic:**
```typescript
// Store last swipe in cache (Redis)
await redis.set(`last_swipe:${userId}`, swipeId, 'EX', 300); // 5 min

// Undo:
const lastSwipe = await redis.get(`last_swipe:${userId}`);
await deleteSwipe(lastSwipe);
await removeFromMatchIfExists();
```

---

### 5. 👀 SEE WHO LIKES YOU (PREMIUM)
**Tại sao:** #1 conversion driver  
**Time:** 3 ngày  
**API:**
```
GET /api/dating/likes/received
```

**Response:**
```json
{
  "likes": [
    {
      "profile": {...},
      "likedAt": "2025-10-08T10:00:00Z",
      "isSuperLike": false
    }
  ],
  "total": 15,
  "isPremium": true
}
```

**Free users:** See blurred photos, count only  
**Premium:** See full profiles

---

### 6. 🔔 PUSH NOTIFICATIONS (CRITICAL)
**Tại sao:** Engagement/Retention  
**Time:** 1 tuần  
**Notifications:**
- New match: "It's a Match! 🎉"
- New message: "John sent you a message"
- New like: "You have 3 new likes"
- Date reminder: "Your date is in 1 hour"
- Inactive: "You have 5 new matches!"

**Implementation:**
- Firebase Cloud Messaging (FCM)
- Apple Push Notification (APNS)
- Web Push API

---

### 7. 🎯 BOOST (MONETIZATION)
**Tại sao:** High-margin revenue  
**Time:** 4 ngày  
**Feature:**
- User's profile shown first for 30 minutes
- Cost: $3.99 per boost
- Expected: 10x profile views

**API:**
```
POST /api/dating/boost/activate
GET  /api/dating/boost/status
```

**Implementation:**
```typescript
// Set boost flag
await redis.set(`boost:${userId}`, '1', 'EX', 1800); // 30 min

// In GetRecommendedProfilesUseCase
const boostedProfiles = await getBoostedProfiles();
return [...boostedProfiles, ...regularProfiles];
```

---

### 8. 📍 DISTANCE FILTER (USER EXPERIENCE)
**Tại sao:** Top user request  
**Time:** 2 ngày  
**Feature:**
- Slider: 1km - 100km
- Save preference
- Update recommendations

**API:**
```
PUT /api/dating/settings/distance
```

**Settings:**
```typescript
interface DatingSettings {
  maxDistance: number;      // km
  ageMin: number;
  ageMax: number;
  showDistance: boolean;    // Hide distance (premium)
  showAge: boolean;         // Hide age (premium)
}
```

---

### 9. 📊 PROFILE VIEWS COUNTER (ENGAGEMENT)
**Tại sao:** Users love to see stats  
**Time:** 2 ngày  
**API:**
```
GET /api/dating/stats/profile-views
```

**Track:**
- Daily/weekly/monthly views
- Who viewed (premium only)
- Peak times
- View → Match conversion

---

### 10. 🛡️ ADMIN MODERATION DASHBOARD (CRITICAL)
**Tại sao:** Content moderation  
**Time:** 1 tuần  
**Features:**
- Review reported users
- Ban/warn users
- Delete inappropriate photos
- Review verification requests
- View user activity logs

**APIs:**
```
GET    /api/admin/reports
PUT    /api/admin/reports/:id/resolve
POST   /api/admin/users/:id/ban
POST   /api/admin/users/:id/warn
DELETE /api/admin/photos/:id
```

---

## 💰 INVESTMENT ESTIMATE (TOP 10)

| Feature | Time | Cost @ $100/hr |
|---------|------|----------------|
| Block & Report | 1 week | $4,000 |
| Photo Verification | 1.5 weeks | $6,000 |
| Unlimited Swipes | 3 days | $2,400 |
| Rewind | 2 days | $1,600 |
| See Who Likes | 3 days | $2,400 |
| Push Notifications | 1 week | $4,000 |
| Boost | 4 days | $3,200 |
| Distance Filter | 2 days | $1,600 |
| Profile Views | 2 days | $1,600 |
| Admin Dashboard | 1 week | $4,000 |
| **TOTAL** | **~4 weeks** | **$30,800** |

---

## 🎯 IMPLEMENTATION ORDER

### Week 1:
✅ Block & Report (Mon-Wed)  
✅ Unlimited Swipes (Thu)  
✅ Rewind (Fri)

### Week 2:
✅ Distance Filter (Mon)  
✅ Profile Views (Tue)  
✅ See Who Likes (Wed-Thu)  
✅ Boost (Fri)

### Week 3:
✅ Push Notifications (Mon-Fri)

### Week 4:
✅ Photo Verification (Mon-Wed)  
✅ Admin Dashboard (Thu-Fri)

---

## 📈 EXPECTED IMPACT

### User Engagement:
- **Push Notifications:** +40% DAU
- **Distance Filter:** +25% match rate
- **Profile Views:** +15% profile updates

### Revenue:
- **Unlimited Swipes:** $9.99/mo × 3% users = $30k/mo @ 100k users
- **See Who Likes:** $19.99/mo × 2% users = $40k/mo
- **Boost:** $3.99 × 10% users × 2/mo = $80k/mo
- **TOTAL:** $150k/mo revenue potential

### Safety:
- **Block & Report:** -80% harassment complaints
- **Photo Verification:** -60% fake profiles
- **Admin Dashboard:** 10x faster moderation

---

## 🚀 QUICK WINS (CÓ THỂ LÀM TRONG 1 TUẦN)

### 1. Swipe Limit (1 day)
```typescript
const DAILY_SWIPE_LIMIT = 50;

if (!user.isPremium && swipeCount >= DAILY_SWIPE_LIMIT) {
  return { 
    error: 'Daily limit reached',
    upgradeUrl: '/premium'
  };
}
```

### 2. Last Active (1 day)
```typescript
// Update last_active_at on every action
await profileRepo.updateLastActive(userId);

// Show in profile
"Active 2 hours ago"
```

### 3. Match Expiration (1 day)
```typescript
// Bumble style: Matches expire in 24h if no message
const expiredMatches = await matchRepo.findExpiredMatches();
await matchRepo.deleteMany(expiredMatches);
```

### 4. Super Like Limit (1 day)
```typescript
// Free: 1 super like/day
// Premium: 5 super likes/day
const superLikeCount = await getSuperLikesToday(userId);
const limit = user.isPremium ? 5 : 1;
```

### 5. Profile Completion Score (2 days)
```typescript
function calculateScore(profile) {
  let score = 0;
  if (profile.photos.length >= 3) score += 30;
  if (profile.bio.length >= 50) score += 20;
  if (profile.interests.length >= 3) score += 10;
  if (profile.occupation) score += 10;
  if (profile.education) score += 10;
  if (profile.isVerified) score += 20;
  return score;
}
```

---

## 🎊 CONCLUSION

### Hiện tại:
- ✅ 7 APIs cơ bản
- ✅ MVP hoạt động
- ❌ Chưa có safety features
- ❌ Chưa có monetization
- ❌ Chưa có engagement tools

### Sau 4 tuần:
- ✅ 17 APIs (7 cũ + 10 mới)
- ✅ Safety features complete
- ✅ Premium features ready
- ✅ Monetization enabled
- ✅ 10x better user experience

### Next Steps:
1. Implement TOP 10 (4 weeks)
2. Test with beta users (1 week)
3. Launch premium subscription
4. Monitor metrics
5. Iterate based on feedback

**BẮT ĐẦU TỪ ĐÂU?**  
→ **Block & Report** (Quan trọng nhất cho user safety!) 🚨
