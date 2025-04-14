import { COLUMN_TYPES, COLUMN_FORMS } from './column.config.js';

export const GEEK_TIME_HOME = 'https://time.geekbang.com';

export const PRODUCT_TYPE_TO_COLUMN_TYPE_MAPPING = {
    '0': COLUMN_TYPES.all,
    '1': COLUMN_TYPES.system,
    '4': COLUMN_TYPES.public,
    '5': COLUMN_TYPES.offline,
    '6': COLUMN_TYPES.community,
    '7': COLUMN_TYPES.daily
};

export const PRODUCT_FORM_TO_COLUMN_FORM_MAPPING = {
    '1': COLUMN_FORMS.article,
    '2': COLUMN_FORMS.video
};
