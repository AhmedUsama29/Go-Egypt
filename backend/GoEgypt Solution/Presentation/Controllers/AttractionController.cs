using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared;
using Shared.Attractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttractionController(IServiceManager _serviceManager) : ControllerBase
    {

        [HttpGet("GetAllCardAttractions")]
        public async Task<ActionResult<PaginatedResponse<CardAttractions>>> GetAllCardAtractions(AttractionsQueryParams queryParams)
        {
            var attractions = await _serviceManager.AttractionService.GetAllAttractionsAsync(queryParams);

            return Ok(attractions);
        }

        [HttpGet("GetHomeAttractions")]
        public async Task<ActionResult<CardAttractions>> GetHomeAttractions()
        {
            var attractions = await _serviceManager.AttractionService.GetHomeAttractionsAsync();
            return Ok(attractions);
        }

        [HttpGet("GetAttractionById/{id}")]
        public async Task<ActionResult<AttractionDetails>> GetAttractionById(int id)
        {
            var attraction = await _serviceManager.AttractionService.GetAttractionByIdAsync(id);
            return Ok(attraction);
        }
    }
}
