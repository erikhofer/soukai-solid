import { SingleModelRelation } from 'soukai';

import SolidModel from '@/models/SolidModel';
import Url from '@/utils/Url';

export default class SolidIsContainedByRelation extends SingleModelRelation {

    protected related: typeof SolidModel;

    public constructor(parent: SolidModel, related: typeof SolidModel) {
        super(parent, related);
    }

    public resolve(): Promise<SolidModel | null> {
        return this.related.find<SolidModel>(Url.relativeBase(this.parent.url));
    }

}
