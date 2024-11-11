import axios, { AxiosResponse } from "axios";

// function to get a single media from the database based on the specificed mediaType (table) and its specific ID
export const fetchMediaData = async (table: string, mediaNumber: string): Promise<Media> => {
    // access the database endpoint
    const response: AxiosResponse = await axios.get('http://localhost:3001/ind', {
      params: {
        table: table,
        search: mediaNumber,
      }
    });
    
    // handle response error
    if (!response) {
      throw new Error('Failed to fetch media');
    }
  
    // returns a single Media
    return await response.data;
};
  
  // function to get media reviews from the database based on the specificed mediaType (table) and its specific ID
export const fetchMediaReviewData = async (mediaID: string, mediaType: string): Promise<MediaReview[]> => {
    // access the database endpoint
    const response: AxiosResponse = await axios.get('http://localhost:3001/review', {
      params: {
        mediaID: mediaID,
        mediaType: mediaType,
      }
    });
    
    // handle response error
    if (!response) {
      throw new Error('Failed to fetch media');
    }
  
    // returns a single Media
    return await response.data;
};

// function to see if the user has already written a review given the media type, media ID, and user ID
export const fetchIfReviewed = async (userID: number, mediaNumber: string, mediaType: string): Promise<boolean> => {
    const response: AxiosResponse = await axios.get('http://localhost:3001/user_review', {
      params: {
        userID: userID,
        mediaID: mediaNumber,
        mediaType: mediaType,
      }
    });
  
    if (!response) {
      throw new Error('Failed to check review status');
    }
  
    return response.data;
};

// Function to fetch media card data based on search query, type, and order
export const fetchMediaCardData = async (query: string, table: string, order: string): Promise<Media[]> => {
    // access the database endpoint
    const response: AxiosResponse = await axios.get('http://localhost:3001/getmedia', {
        params: {
          table: table,
          search: query,
          order: order,
        }
    });

    // handle response error
    if (!response) {
        throw new Error('Failed to fetch media');
    }

    // returns a list of Media
    return await response.data; 
};

// function to upload or edit a review to the database
export const uploadReview = async (endpoint: string, mediaNumber: string, userID: number, rating: number, summary: string, text: string, mediaType: string): Promise<void> => {
    // access the database endpoint (endpoint can be uploadreview or editreview)
    const response: AxiosResponse = await axios.post(`http://localhost:3001/${endpoint}`, {
        mediaID: mediaNumber,
        userID: userID,
        rating: rating,
        summary: summary,
        text: text,
        mediaType: mediaType,
    });

    // handle response error
    if (!response) {
        throw new Error('Failed to fetch media');
    }
};

// function to delete a review from the database
export const deleteReview = async (mediaNumber: string, userID: number, mediaType: string): Promise<void> => {
    // access the database endpoint
    const response: AxiosResponse = await axios.post(`http://localhost:3001/delete_review`, {
        mediaID: mediaNumber,
        userID: userID,
        mediaType: mediaType,
    });

    // handle response error
    if (!response) {
        throw new Error('Failed to delete review');
    }
};

// function to get all users and their info
export const getUsers = async (): Promise<User[]> => {
  // access the database endpoint
  const users: AxiosResponse = await axios.get('http://localhost:3001/get_users', {});

  // handle response error
  if (!users) {
      throw new Error('Failed to fetch media');
  }

  // returns a list of Media
  return await users.data; 
};

// function to get a user's info for a particular ID
export const getUserByID = async (userID: number): Promise<User> => {
  try {
      // Access the database endpoint
      const user: AxiosResponse<User> = await axios.get('http://localhost:3001/get_user_by_id', {
          params: { userID }
      });

      // Handle response error
      if (!user.data) {
          throw new Error('Failed to fetch user');
      }

      // Return user data
      return user.data;
  } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
  }
};
