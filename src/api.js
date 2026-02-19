const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9sCWXKRl2ZqA7f8OqAo36FUkt0YmMjZkxvUt7DxXy06aOEJOfZ2bxeT9dO3KOn4om/exec';

export const fetchData = async (action, month = '') => {
    try {
        const url = `${GOOGLE_SCRIPT_URL}?action=${action}&month=${month}`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return { success: false, error: "Network error" };
    }
};

export const saveData = async (entity, row, data, month = '') => {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requires no-cors sometimes for simple POSTs or handling redirects manually
            body: JSON.stringify({ entity, row, data, month })
        });
        return { success: true }; // no-cors doesn't return body, we assume success if fetch finishes
    } catch (error) {
        console.error("Error saving data:", error);
        return { success: false };
    }
};
