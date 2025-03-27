// Divide & conquer skyline (2D)
export const computeSkylineDAC = (data, attr1, attr2) => {
    if (data.length <= 1) return data;
  
    const mid = Math.floor(data.length / 2);
    const left = computeSkylineDAC(data.slice(0, mid), attr1, attr2);
    const right = computeSkylineDAC(data.slice(mid), attr1, attr2);
  
    // Merge: keep only points not dominated across halves
    return [...left, ...right].filter((a) =>
      ![...left, ...right].some(
        (b) =>
          b !== a &&
          b[attr1] >= a[attr1] &&
          b[attr2] <= a[attr2] &&
          (b[attr1] > a[attr1] || b[attr2] < a[attr2])
      )
    );
  };
  