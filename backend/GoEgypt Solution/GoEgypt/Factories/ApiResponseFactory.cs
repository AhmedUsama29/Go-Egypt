using Microsoft.AspNetCore.Mvc;
using Shared.ErrorModels;

namespace GoEgypt.Factories
{
    public class ApiResponseFactory
    {

        public static IActionResult GenerateApiValidationResponse(ActionContext context)
        {
            var errors = context.ModelState
                .Where(modelStateEntry => modelStateEntry.Value.Errors.Any())
                .Select(modelStateEntry => new ValidationError()
                {
                    Field = modelStateEntry.Key,
                    Errors = modelStateEntry.Value.Errors.Select(err => err.ErrorMessage)
                });
            var response = new ValidationErrorModel()
            {
                ValidationErrors = errors
            };
            return new BadRequestObjectResult(response);
        }

    }
}
