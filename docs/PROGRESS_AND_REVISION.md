# CodeDrill — Progress, Retention & Algorithmic Specifications

**Version:** 1.0.0  
**Status:** Approved for Review (Phase 0)  
**Author:** Full-Stack TypeScript Architect  

---

## 1. Topic Mastery Score Formula

The **Topic Mastery Score** ($M \in [0, 100]$) quantitatively measures a learner's fluency and sustained retention in a specific topic. Rather than a naive `solved / total` percentage, CodeDrill uses an engineered multi-factor scoring formula that weights question difficulty, accuracy, and spaced-retention stability:

$$M = \min\left(100, \; \text{round}\left( 0.40 \cdot S_{\text{coverage}} + 0.35 \cdot A_{\text{weighted}} + 0.25 \cdot R_{\text{retention}} \right)\right)$$

### 1.1 Factor Breakdown

#### 1. Coverage Factor ($S_{\text{coverage}} \in [0, 100]$)
Measures the depth of unique problems solved in the topic relative to total available:
$$S_{\text{coverage}} = \left( \frac{N_{\text{solved}}}{N_{\text{total\_in\_topic}}} \right) \times 100$$

#### 2. Weighted Accuracy Factor ($A_{\text{weighted}} \in [0, 100]$)
Awards higher weight to harder problems solved without failing attempts:
$$A_{\text{weighted}} = \frac{\sum_{i \in \text{solved}} W(d_i) \cdot \text{Acc}_i}{\sum_{i \in \text{solved}} W(d_i)} \times 100$$
Where weights $W(d)$ by difficulty are:
- $\text{Easy: } 1.0$
- $\text{Medium: } 2.0$
- $\text{Hard: } 3.5$
And $\text{Acc}_i = \frac{1}{\text{total\_attempts\_on\_question\_i}}$ (first-try solve = $1.0$; multiple tries decay toward $0.3$).

#### 3. Retention Stability Factor ($R_{\text{retention}} \in [0, 100]$)
Measures performance on questions undergoing active spaced-repetition recall:
$$R_{\text{retention}} = \left( \frac{\sum_{j \in \text{reviewed}} \text{EaseFactor}_j - 1.30}{2.50 - 1.30} \right) \times 100$$
If no items have entered spaced review yet, $R_{\text{retention}}$ defaults to $A_{\text{weighted}}$.

---

## 2. Spaced Repetition Engine (SM-2 Variant)

CodeDrill adapts the SuperMemo-2 (SM-2) algorithm for deliberate coding practice. After solving a question or reviewing a flashcard, the user rates their recall quality on a 0–5 scale:

### 2.1 Quality Rating Scale ($q$)
| Rating ($q$) | Label | Cognitive State | Next Interval Action |
| :---: | :--- | :--- | :--- |
| **0** | Blackout | Complete lack of recall; couldn't recognize solution. | Reset interval to 1 day; Ease Factor drops. |
| **1** | Incorrect | Wrong answer; remembered after seeing explanation. | Reset interval to 1 day; Ease Factor drops. |
| **2** | Hard (Failed) | Got it wrong or required hint/peek at solution. | Reset interval to 1 day; Ease Factor drops. |
| **3** | Hard (Passed) | Correct after serious hesitation/long thinking. | Interval advances; Ease Factor decreases slightly. |
| **4** | Good | Correct with slight hesitation; normal recall. | Interval advances; Ease Factor preserved. |
| **5** | Perfect | Instant, effortless recall of contracts and edge cases. | Interval advances; Ease Factor increases. |

### 2.2 Mathematical Recurrence Relations

1. **Repetition Count ($n$):**
   $$\text{If } q < 3 \implies n = 0$$
   $$\text{If } q \ge 3 \implies n = n + 1$$

2. **Interval Calculation ($I$ in days):**
   $$I(n) = \begin{cases} 
   1 & \text{if } n = 1 \\
   6 & \text{if } n = 2 \\
   \text{round}(I(n - 1) \cdot EF) & \text{if } n > 2 
   \end{cases}$$
   *(If $q < 3$, next interval is forcibly set to $I = 1$ day).*

3. **Ease Factor Update ($EF$):**
   $$EF' = EF + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02))$$
   $$\text{Bound: } EF' = \max(1.30, \; EF')$$
   - Initial value: $EF_0 = 2.50$.
   - Hard minimum: $1.30$ (prevents exponential stalling).

### 2.3 Due Date Calculation
$$\text{dueDate} = \text{CurrentTimestamp} + (I(n) \times 86,400,000 \text{ ms})$$

---

## 3. Daily Streak & Activity Heatmap Rules

### 3.1 Streak Progression Invariants
- A day qualifies for the streak if the user completes **at least 1 submission** (MCQ, Output, Fill-in, Code, or Review) between `00:00:00` and `23:59:59` in the user's localized timezone (or UTC default).
- Completing the **Daily Challenge** awards streak preservation even if completed in another timezone window within a 6-hour grace period.

```typescript
export function evaluateStreak(
  lastActiveDateStr: string | null, // 'YYYY-MM-DD'
  currentStreak: number,
  longestStreak: number,
  todayStr: string // 'YYYY-MM-DD'
): { currentStreak: number; longestStreak: number; streakMaintained: boolean } {
  if (!lastActiveDateStr) {
    return { currentStreak: 1, longestStreak: 1, streakMaintained: true };
  }

  const daysDifference = differenceInCalendarDays(
    parseISO(todayStr),
    parseISO(lastActiveDateStr)
  );

  if (daysDifference === 0) {
    // Already practiced today; streak unchanged
    return { currentStreak, longestStreak, streakMaintained: true };
  } else if (daysDifference === 1) {
    // Active on consecutive calendar day; streak increments
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      streakMaintained: true
    };
  } else {
    // Lapsed by 2 or more days; streak resets to 1
    return { currentStreak: 1, longestStreak, streakMaintained: false };
  }
}
```

---

## 4. Weak-Topic Detection & Remediation Engine

To prevent passive learning and false mastery illusions, CodeDrill automatically monitors failure patterns and tags problematic topics:

### 4.1 Weak Topic Threshold Criteria
A topic is classified as **Weak Topic** (`isWeakTopic: true`) when both conditions are met:
1. **Sample Size Criterion:** Total questions attempted in topic $\ge 5$.
2. **Accuracy Failure Criterion:** Accuracy rate $< 60.0\%$ OR average SM-2 Ease Factor $< 1.80$.

### 4.2 Auto-Remediation Workflow
When a topic is flagged as weak:
1. A **"Needs Focus"** pill appears on the topic card in Learn Mode and the User Dashboard.
2. The user's revision queue automatically bumps failed questions from this topic to priority position.
3. The dashboard recommends a targeted 5-question micro-drill focused strictly on the missed concept patterns.
4. The topic exits "Weak" status once accuracy over the most recent 10 attempts reaches $\ge 75\%$.
