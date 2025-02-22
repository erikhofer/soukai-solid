import {
    Attributes,
    BelongsToManyRelation,
    Engine,
    EngineDocument,
    EngineDocumentsCollection,
    EngineFilters,
    EngineUpdates,
    FieldDefinition,
    FieldsDefinition,
    HasManyRelation,
    Model,
    MultiModelRelation,
    SingleModelRelation,
    SoukaiError,
} from 'soukai';

export class SolidContainsRelation<
    Parent extends SolidContainerModel = SolidContainerModel,
    Related extends SolidModel = SolidModel,
    RelatedClass extends typeof SolidModel = typeof SolidModel,
> extends BelongsToManyRelation<Parent, Related, RelatedClass> {

    public create(attributes?: Attributes): Promise<Related>;

    public save(model: Related): Promise<void>;

}

export class SolidHasManyRelation<
    Parent extends SolidModel = SolidModel,
    Related extends SolidModel = SolidModel,
    RelatedClass extends typeof SolidModel = typeof SolidModel,
> extends HasManyRelation<Parent, Related, RelatedClass> {

    public useSameDocument: boolean;

    public create(attributes?: Attributes): Promise<Related>;

    public save(model: Related): Promise<void>;

    public add(model: Related): void;

    public usingSameDocument(useSameDocument?: boolean): this;

}

export interface SolidFieldsDefinition extends FieldsDefinition {
    [field: string]: SolidFieldDefinition;
}

export interface SolidFieldDefinition extends FieldDefinition {
    rdfProperty: string;
}

export abstract class SolidModel extends Model {

    public static fields: SolidFieldsDefinition | any;

    public static rdfContexts: { [alias: string]: string };

    public static rdfsClasses: string[] | Set<string>;

    public static defaultResourceHash: string;

    public static mintsUrls: boolean;

    public static instance: SolidModel;

    public static from(containerUrl: string): typeof SolidModel;

    public static at(containerUrl: string): typeof SolidModel;

    public static prepareEngineFilters(filters?: EngineFilters): EngineFilters;

    public static newInstance<M extends SolidModel>(attributes: Attributes, exists?: boolean): M;

    public static newFromJsonLD<T extends SolidModel>(json: object, baseUrl?: string): Promise<T>;

    public static createFromEngineDocument<T extends Model, Key = any>(
        id: Key,
        document: EngineDocument,
        resourceId?: string,
    ): Promise<T>;

    protected static withCollection<Result>(collection?: string | (() => Result), operation?: () => Result): Result;

    protected static pureInstance: SolidModel;

    public modelClass: typeof SolidModel;

    protected _documentExists: boolean;
    protected _sourceDocumentUrl: string | null;

    public save<T extends Model>(containerUrl?: string): Promise<T>;

    public mintUrl(documentUrl?: string, documentExists?: boolean, resourceHash?: string): void;

    public toJsonLD(): object;

    public getIdAttribute(): string;

    public documentExists(): boolean;

    public setDocumentExists(documentExists: boolean): void;

    public getDocumentUrl(): string | null;

    public getSourceDocumentUrl(): string | null;

    public getContainerUrl(): string | null;

    public getSourceContainerUrl(): string | null;

    protected createFromEngineDocument<T extends Model, Key = any>(
        id: Key,
        document: EngineDocument,
        resourceId?: string,
    ): Promise<T>;

    protected getDefaultRdfContext(): string;

    protected getDirtyEngineDocumentUpdates(): EngineUpdates;

    protected hasMany(relatedClass: typeof SolidModel, foreignKeyField?: string, localKeyField?: string): SolidHasManyRelation;

    protected belongsToMany(relatedClass: typeof SolidModel, foreignKeyField?: string, localKeyField?: string): MultiModelRelation;

    protected isContainedBy(model: typeof SolidModel): SingleModelRelation;

    protected newUrl(documentUrl?: string, resourceHash?: string): string;

    protected guessCollection(): string | undefined;

}

export class SolidDocument extends SolidModel {}

export abstract class SolidContainerModel extends SolidModel {

    resourceUrls: string[];
    documents: SolidDocument[];
    relatedDocuments: MultiModelRelation<SolidContainerModel, SolidDocument, typeof SolidDocument>;

    public documentsRelationship(): MultiModelRelation;

    protected contains(model: typeof SolidModel): MultiModelRelation;

}

interface RequestOptions {
    headers?: object;
    method?: string;
    body?: string;
}

export type Fetch = (url: string, options?: RequestOptions) => Promise<Response>;

export interface SolidEngineConfig {
    globbingBatchSize: number | null;
}

export interface SolidEngineListener {
    onRDFDocumentLoaded?(url: string, metadata: RDFDocumentMetadata): void;
}

export class SolidEngine implements Engine {

    constructor(fetch: Fetch, config?: Partial<SolidEngineConfig>);

    create(collection: string, document: EngineDocument, id?: string): Promise<string>;

    readOne(collection: string, id: string): Promise<EngineDocument>;

    readMany(collection: string, filters?: EngineFilters): Promise<EngineDocumentsCollection>;

    update(collection: string, id: string, updates: EngineUpdates): Promise<void>;

    delete(collection: string, id: string): Promise<void>;

    addListener(listener: SolidEngineListener): void;

    removeListener(listener: SolidEngineListener): void;

}

export interface RDFDocumentMetadata {
    containsRelativeIRIs?: boolean;
    describedBy?: string;
}

export enum DocumentFormat {
    RDF = 'RDF',
}

export class MalformedDocumentError extends SoukaiError {

    public readonly documentUrl: string;
    public readonly documentFormat: DocumentFormat;
    public readonly malformationDetails: string;

    constructor(documentUrl: string, documentFormat: DocumentFormat, malformationDetails: string);

}

export class NetworkError extends SoukaiError {

    public readonly original: Error;

    constructor(message: string, error: Error);

}

interface SoukaiSolid {
    loadSolidModels(): void;
}

declare const SoukaiSolid: SoukaiSolid;

export default SoukaiSolid;
