// types.ts
export interface Media {
    id: string;
    title: string;
    image_url: string; // URL to the image
    author?: string;
    studio?: string;
    writer?: string;
    director?: string;
    // Add other relevant fields as needed
}
