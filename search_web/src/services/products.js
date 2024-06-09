const baseUrl = 'http://34.128.189.73/api';

export const getProductByProductId = async (productId) => {
    const retry = 2;
    for (let i = 0; i < retry; i++) {
        try {
            const response = await fetch(`${baseUrl}/history-product/${productId}`);
            const jsonResponse = await response.json();
            if (response.status === 201 || response.status === 200) {
                return jsonResponse;
            }
            else {
                throw new Error(`Error getting product by product id: ${productId}`);
            }
        } catch (error) {
            console.error(`Error getting product by product id: ${productId}`, error);
        }
    }
    return null;
}