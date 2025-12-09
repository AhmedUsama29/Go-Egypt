using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Services.Specifications;
using ServicesAbstraction;
using Shared;
using Shared.Attractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AttractionService(IUnitOfWork _unitOfWork) : IAttractionService
    {
        public async Task<PaginatedResponse<CardAttractions>> GetAllAttractionsAsync(AttractionsQueryParams queryParams)
        {
            var repo = _unitOfWork.GetRepository<Attraction, int>();

            var specs = new AttractionsByCategoryAndLocationSpecification(queryParams);

            var totalCount = await repo.CountAsync(specs);

            var attractions = await repo.GetAllAppDbAsync(specs);

            var mappedItems = attractions.Select(attraction => new CardAttractions
            {
                Id = attraction.Id,
                Name = attraction.Name,
                Location = attraction.Location,
                OpeningTime = attraction.OpeningTime,
                ClosingTime = attraction.ClosingTime,
                Overview = attraction.Overview,
                MainPhotoPath = attraction.MainPhotoPath,
                Category = attraction.Category
            }).ToList();

            return new PaginatedResponse<CardAttractions>()
            {
                PageIndex = queryParams.PageIndex,
                PageSize = queryParams.PageSize,
                Count = totalCount,
                Data = mappedItems
            };
        }

        public async Task<AttractionDetails> GetAttractionByIdAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Attraction, int>();

            var specs = new AttractionsByCategoryAndLocationSpecification(id);

            var attraction = await repo.GetByIdAppDbAsync(specs) ??
                throw new AttractionNotFoundException(id);

            var mappedAttraction = new AttractionDetails()
            {
                Id = attraction.Id,
                Name = attraction.Name,
                Location = attraction.Location,
                Overview = attraction.Overview,
                OpeningTime = attraction.OpeningTime,
                ClosingTime = attraction.ClosingTime,
                MainPhotoPath = attraction.MainPhotoPath,
                Category = attraction.Category,
                Gallery = attraction.Gallery,
                KeyFacts = attraction.KeyFacts.Select(kf => new Shared.Attractions.KeyFact
                {
                    Headline = kf.Headline,
                    Description = kf.Description
                }).ToList()

            };

            return mappedAttraction;
        }

        public async Task<List<HomeAttractions>> GetHomeAttractionsAsync()
        {
            var repo = _unitOfWork.GetRepository<Attraction, int>();

            var queryparams = new AttractionsQueryParams()
            {
                PageIndex = 1,
                PageSize = 4
            };

            var specs = new AttractionsByCategoryAndLocationSpecification(queryparams);

            var allAttractions = await repo.GetAllAppDbAsync(specs);

            var mappedAttractions = allAttractions.Select(attraction => new HomeAttractions
            {
                id = attraction.Id,
                Name = attraction.Name,
                MainPhotoPath = attraction.MainPhotoPath,
                Location = attraction.Location,
                OpeningTime = attraction.OpeningTime,
                ClosingTime = attraction.ClosingTime
            }).ToList();

            return mappedAttractions;
        
        }
    }
}
