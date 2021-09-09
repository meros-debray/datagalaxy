/* eslint-disable import/no-cycle */
import { Action, Thunk, Actions, thunk, action } from 'easy-peasy';
import { fetchEntity as fetchEntityAPI, EntityType } from 'shared';
import { enhancedEntitiesWithUserInfo } from './helper';

/**
 * This model aims to managed the currently displayed entity in the extension
 */

export interface EntityModel {
    /* State */
    displayedEntity: EntityType;
    /* Actions */
    updateDisplayedEntity: Action<EntityModel, EntityType>;
    /* Thunks */
    fetchEntity: Thunk<EntityModel, string>;
}

/**
 * Thunks
 */

const fetchEntity = thunk(async (actions: Actions<EntityModel>, location: string, { getStoreState }) => {
    try {
        const url = (getStoreState() as any).auth.pubapi;
        // First search for results
        const entity = await fetchEntityAPI(url, location);

        // Then enrich the entity object with required user info
        const [enhancedEntity] = await enhancedEntitiesWithUserInfo([entity], url);

        actions.updateDisplayedEntity(enhancedEntity);
    } catch (err) {
        console.log('error : ', err);
    }
});

/**
 * Entity Model Instance
 */

const entityModel = async (): Promise<EntityModel> => {
    return {
        /* State */
        displayedEntity: null,
        /* Actions */
        updateDisplayedEntity: action((state, payload: EntityType) => {
            state.displayedEntity = payload;
        }),
        /* Thunks */
        fetchEntity,
    };
};

export default entityModel;
