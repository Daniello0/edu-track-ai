import * as yup from 'yup';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { PROFILE_VALIDATION_MESSAGES } from './profile.constants';
import type { UpdateMaterialStatusRequest } from './profile.types';

/**
 * Yup schema for PATCH /api/library/:id/status request body.
 */
export const updateMaterialStatusSchema = yup
  .object({
    status: yup
      .mixed<MaterialStatus>()
      .oneOf(
        [MaterialStatus.READ, MaterialStatus.RETAKE, MaterialStatus.MASTERED],
        PROFILE_VALIDATION_MESSAGES.INVALID_STATUS,
      )
      .required(PROFILE_VALIDATION_MESSAGES.INVALID_STATUS),
  })
  .required() satisfies yup.ObjectSchema<UpdateMaterialStatusRequest>;
