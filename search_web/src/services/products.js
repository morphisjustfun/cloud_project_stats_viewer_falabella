const baseUrl = 'http://34.128.189.73/api';

export const getProductByProductId = async (productId, retry = 2) => {
    try {
        const response = await fetch(`${baseUrl}/product/${productId}`);
        return await response.json();
    } catch (error) {
        if (retry > 0) {
            return getProductByProductId(productId, retry - 1);
        }
        return null;
    }
}