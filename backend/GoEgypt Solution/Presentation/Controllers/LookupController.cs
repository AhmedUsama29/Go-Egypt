using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupController(IServiceManager _serviceManager) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> GetCountries()
        {
            var countries = await _serviceManager.LookupServices.GetNationalitiesAsync();
            return Ok(countries);
        }
    }
}
