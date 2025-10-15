// ----------------------------------------------------------------------
// File: ServiceProviderService.ts
// Path: backend/services/ServiceProviderService.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:32 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified service to manage the lifecycle of all service providers.
// Handles profile creation, verification, and management of type-specific data.
//
// ----------------------------------------------------------------------

import ServiceProviderProfile from '@/models/ServiceProviderProfile';
// Zod schemas would be created for validation

const ServiceProviderService = {
  /**
   * Creates a new, unverified profile for a user becoming a service provider.
   */
  async createProfile(userId: string, profileInfo: any) {
    // Zod validation would go here
    const { providerType, businessName, licenseNumber, profileData } = profileInfo;

    const newProfile = new ServiceProviderProfile({
      user: userId,
      providerType,
      businessName,
      licenseNumber,
      profileData,
      status: 'PENDING_VERIFICATION',
    });

    await newProfile.save();
    return newProfile;
  },

  /**
   * Updates the flexible profileData for a given provider.
   * This can be used to set Lender Terms, Insurer Coverage, etc.
   */
  async updateProfileData(userId: string, data: object) {
    const profile = await ServiceProviderProfile.findOneAndUpdate(
      { user: userId },
      { $set: { profileData: data } },
      { new: true }
    );
    if (!profile) throw new Error('Service provider profile not found.');
    return profile;
  },

  /**
   * (Admin) Changes the verification status of a provider.
   */
  async changeStatus(profileId: string, newStatus: 'ACTIVE' | 'SUSPENDED') {
    const profile = await ServiceProviderProfile.findByIdAndUpdate(
        profileId,
        { $set: { status: newStatus } },
        { new: true }
    );
    if (!profile) throw new Error('Service provider profile not found.');
    return profile;
  },
};

export default ServiceProviderService;