import { isWooConfigured, wooFetch } from './config';
import type { WooReview } from '@/types/woocommerce';

export const wooReviewService = {
  async getProductReviews(productId: number): Promise<WooReview[]> {
    if (isWooConfigured) {
      try {
        return await wooFetch<WooReview[]>(`products/reviews?product=${productId}`);
      } catch (err) {
        console.warn(`WooCommerce getProductReviews for ${productId} failed:`, err);
      }
    }
    return [];
  },

  async createReview(productId: number, review: string, rating: number, reviewer: string, reviewer_email: string): Promise<WooReview | null> {
    if (isWooConfigured) {
      try {
        return await wooFetch<WooReview>('products/reviews', {
          method: 'POST',
          body: JSON.stringify({
            product_id: productId,
            review,
            rating,
            reviewer,
            reviewer_email
          })
        });
      } catch (err) {
        console.warn('WooCommerce createReview failed:', err);
      }
    }
    return {
      id: Date.now(),
      date_created: new Date().toISOString(),
      product_id: productId,
      status: 'approved',
      reviewer,
      reviewer_email,
      review,
      rating,
      verified: true
    };
  }
};
