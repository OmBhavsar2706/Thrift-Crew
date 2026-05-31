export async function shopifyFetch<T>(query: string, variables = {}): Promise<{ status: number; body: T }> {
  // Use Vite's import.meta.env for client-side environment variables
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !storefrontAccessToken) {
    throw new Error('Shopify environment variables are not set.');
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}
