export const computeSkylineBrute = (data, attr1, attr2) =>
    data.filter((a) =>
      !data.some(
        (b) =>
          b !== a &&
          b[attr1] >= a[attr1] &&
          b[attr2] <= a[attr2] &&
          (b[attr1] > a[attr1] || b[attr2] < a[attr2])
      )
    );  