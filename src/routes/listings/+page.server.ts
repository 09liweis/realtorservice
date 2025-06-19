import { getListings } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const search = url.searchParams.get('search') || '';
  const type = url.searchParams.get('type') || '';
  const location = url.searchParams.get('location') || '';
  const minPrice = url.searchParams.get('minPrice') || '';
  const maxPrice = url.searchParams.get('maxPrice') || '';
  const bedrooms = url.searchParams.get('bedrooms') || '';
  const bathrooms = url.searchParams.get('bathrooms') || '';

  const limit = 12; // Items per page
  const offset = (page - 1) * limit;

  try {
    // Get all listings (public view - no user_id filter)
    const { data: allListings, error } = await getListings();

    if (error) {
      throw error;
    }

    let filteredListings = allListings || [];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredListings = filteredListings.filter(listing =>
        listing.project_name?.toLowerCase().includes(searchLower) ||
        listing.address?.toLowerCase().includes(searchLower) ||
        listing.location?.toLowerCase().includes(searchLower) ||
        listing.description?.toLowerCase().includes(searchLower)
      );
    }

    if (type) {
      filteredListings = filteredListings.filter(listing =>
        listing.ptype?.toLowerCase() === type.toLowerCase()
      );
    }

    if (location) {
      filteredListings = filteredListings.filter(listing =>
        listing.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      filteredListings = filteredListings.filter(listing =>
        parseFloat(listing.asking_price || '0') >= min
      );
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filteredListings = filteredListings.filter(listing =>
        parseFloat(listing.asking_price || '0') <= max
      );
    }

    if (bedrooms) {
      filteredListings = filteredListings.filter(listing =>
        listing.bedroom === bedrooms
      );
    }

    if (bathrooms) {
      filteredListings = filteredListings.filter(listing =>
        listing.bathroom === bathrooms
      );
    }

    // Calculate pagination
    const totalItems = filteredListings.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedListings = filteredListings.slice(offset, offset + limit);

    // Get unique values for filter options
    const propertyTypes = [...new Set(allListings.map(l => l.ptype).filter(Boolean))];
    const locations = [...new Set(allListings.map(l => l.location).filter(Boolean))];
    const bedroomOptions = [...new Set(allListings.map(l => l.bedroom).filter(Boolean))].sort();
    const bathroomOptions = [...new Set(allListings.map(l => l.bathroom).filter(Boolean))].sort();

    return {
      listings: paginatedListings,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      filters: {
        search,
        type,
        location,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms
      },
      filterOptions: {
        propertyTypes,
        locations,
        bedroomOptions,
        bathroomOptions
      }
    };
  } catch (error) {
    console.error('Error loading listings:', error);
    return {
      listings: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit
      },
      filters: {
        search: '',
        type: '',
        location: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: ''
      },
      filterOptions: {
        propertyTypes: [],
        locations: [],
        bedroomOptions: [],
        bathroomOptions: []
      },
      error: 'Failed to load listings'
    };
  }
};