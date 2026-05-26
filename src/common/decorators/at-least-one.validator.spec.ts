import { validate } from 'class-validator';
import { AtLeastOneOf } from './at-least-one.validator';

class TestDto {
    @AtLeastOneOf(['field1', 'field2'])
    field1?: string;
    field2?: string;
}

describe('AtLeastOneOf Validator', () => {
    it('should pass if at least one field is provided', async () => {
        const dto = new TestDto();
        dto.field1 = 'value';
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should pass if both fields are provided', async () => {
        const dto = new TestDto();
        dto.field1 = 'value1';
        dto.field2 = 'value2';
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should pass if only the second field is provided', async () => {
        const dto = new TestDto();
        dto.field2 = 'value';
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail if no fields are provided', async () => {
        const dto = new TestDto();
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('AtLeastOneOf');
    });
});
