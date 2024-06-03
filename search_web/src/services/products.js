const baseUrl = 'http://34.128.189.73/api';

export const getProductByProductId = async (productId) => {
    const response = await fetch(`${baseUrl}/history-product/${productId}`);
    return await response.json();
}