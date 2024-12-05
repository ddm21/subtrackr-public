interface SplitResult {
  amounts: number[];
  isValid: boolean;
  error?: string;
}

/**
 * Calculates individual split amounts ensuring the total sum is exact
 */
export function calculateSplitAmounts(total: number, numParticipants: number): SplitResult {
  if (numParticipants <= 0) {
    return {
      amounts: [],
      isValid: false,
      error: 'Number of participants must be greater than 0'
    };
  }

  if (total <= 0) {
    return {
      amounts: [],
      isValid: false,
      error: 'Total amount must be greater than 0'
    };
  }

  // Calculate base amount per participant (excluding user's share)
  const totalToSplit = total / 2; // User has already paid half
  const baseAmount = +(totalToSplit / numParticipants).toFixed(2);
  const amounts = Array(numParticipants).fill(baseAmount);
  
  // Calculate remaining cents to distribute
  const sum = baseAmount * numParticipants;
  const remainder = +(totalToSplit - sum).toFixed(2);
  
  if (remainder !== 0) {
    // Add or subtract the remainder from the last amount to ensure exact total
    amounts[amounts.length - 1] = +(amounts[amounts.length - 1] + remainder).toFixed(2);
  }
  
  return {
    amounts,
    isValid: true
  };
}

/**
 * Validates if the split amounts match the total
 */
export function validateSplitAmounts(total: number, amounts: number[]): boolean {
  if (amounts.length === 0) return false;
  
  const sum = amounts.reduce((acc, amount) => acc + amount, 0);
  const expectedTotal = total / 2; // Half of the total since user paid their share
  return Math.abs(sum - expectedTotal) < 0.01; // Account for floating point precision
}

/**
 * Resets split calculation state
 */
export function resetSplitCalculation(): SplitResult {
  return {
    amounts: [],
    isValid: true
  };
}